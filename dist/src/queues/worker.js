"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWorker = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const enums_1 = require("../../generated/prisma/enums");
const archiver_1 = __importDefault(require("archiver"));
const axios_1 = __importDefault(require("axios"));
const bullmq_1 = require("bullmq");
const form_data_1 = __importDefault(require("form-data"));
const configs_1 = require("../configs");
const queue_1 = require("../queues/queue");
const prisma_lib_1 = require("../shared/libs/prisma.lib");
const redis_lib_1 = require("../shared/libs/redis.lib");
const sleep_util_1 = require("../shared/utils/sleep.util");
const initWorker = () => {
    const aiWorker = new bullmq_1.Worker('aiQueue', async (job) => {
        const { id, dir } = job.data;
        console.log(`[AI] Starting: ${id}`);
        try {
            await prisma_lib_1.prisma.forecast.update({
                where: { id },
                data: { aiStatus: enums_1.AIStatus.PROCESSING },
            });
            const forecast = await prisma_lib_1.prisma.forecast.findUnique({
                where: { id },
            });
            if (!forecast || !forecast.inputData) {
                throw new Error(`[AI Worker] forecast not found (${id})`);
            }
            const inputData = forecast.inputData;
            const predictUrl = `${configs_1.config.forecast.url}/predict`;
            const data = {
                lat: inputData.latitude,
                lon: inputData.longitude,
                wind_speed_mps: inputData.windSpeed,
                wind_direction_deg: inputData.windDirection,
                prediction_minutes: '5,10,15',
            };
            const response = await axios_1.default.post(predictUrl, data);
            const jobId = response.data.id;
            // wait for result
            const interval = 5;
            const total = 300;
            const maxRetry = total / interval;
            let retry = 0;
            const jobUrl = `${configs_1.config.forecast.url}/jobs/${jobId}`;
            let job;
            while (retry < maxRetry) {
                const res = await axios_1.default.get(jobUrl, { timeout: 10000 });
                job = res.data;
                if (job.status === 'failed') {
                    throw new Error(`[AI Worker] forecast failed (${id})`);
                }
                if (job.status === 'completed') {
                    break;
                }
                retry++;
                await (0, sleep_util_1.sleep)(interval);
            }
            const geojson = job.prediction_geojson_data;
            if (!job || !geojson) {
                throw new Error(`[AI Worker] forecast failed (${id})`);
            }
            fs_1.default.writeFileSync(path_1.default.join(dir, 'output', 'result.json'), JSON.stringify(geojson, null, 2));
            if (geojson && geojson.length > 0) {
                const results = geojson.map((item) => {
                    const match = item.filename.match(/_(\d+)min/);
                    const forecastId = forecast.id;
                    const filename = item.filename;
                    const minutes = Number(match[1]);
                    const validAt = item.geojson.valid_at;
                    const geojsonData = {
                        geometry: item.geojson.features[0].geometry,
                    };
                    return {
                        forecastId,
                        filename,
                        minutes,
                        validAt,
                        geojsonData,
                    };
                });
                await prisma_lib_1.prisma.$transaction([
                    prisma_lib_1.prisma.forecastResult.deleteMany({
                        where: { forecastId: forecast.id },
                    }),
                    prisma_lib_1.prisma.forecastResult.createMany({
                        data: results,
                    }),
                ]);
            }
            await prisma_lib_1.prisma.forecast.update({
                where: { id },
                data: { aiStatus: enums_1.AIStatus.COMPLETED },
            });
            await queue_1.pushQueue.add('pushQueue', { id: forecast.id });
            // Call pushQueue
        }
        catch (error) {
            await prisma_lib_1.prisma.forecast.update({
                where: { id },
                data: { aiStatus: enums_1.AIStatus.FAILED },
            });
            console.error(error);
            throw error;
        }
    }, {
        connection: redis_lib_1.redis,
        concurrency: 1,
    });
    const pushWorker = new bullmq_1.Worker('pushQueue', async (job) => {
        const { id } = job.data;
        console.log(`[PUSH] Starting: ${id}`);
        try {
            await prisma_lib_1.prisma.forecast.update({
                where: { id },
                data: { pushStatus: enums_1.PushStatus.PUSHING },
            });
            await zipAndUpload(id);
            await prisma_lib_1.prisma.forecast.update({
                where: { id },
                data: { pushStatus: enums_1.PushStatus.PUSHED },
            });
        }
        catch (error) {
            await prisma_lib_1.prisma.forecast.update({
                where: { id },
                data: { pushStatus: enums_1.PushStatus.FAILED },
            });
            console.error(error);
            throw error;
        }
    }, {
        connection: redis_lib_1.redis,
        concurrency: 1,
    });
};
exports.initWorker = initWorker;
async function zipAndUpload(id) {
    const dir = path_1.default.join(configs_1.config.app.forecastDir, id);
    const zipPath = path_1.default.join(configs_1.config.app.forecastDir, `${id}.zip`);
    try {
        await new Promise((resolve, reject) => {
            const output = fs_1.default.createWriteStream(zipPath);
            const archive = (0, archiver_1.default)('zip', { zlib: { level: 9 } });
            output.on('close', () => resolve());
            archive.on('error', (err) => reject(err));
            archive.pipe(output);
            archive.directory(dir, false);
            archive.finalize();
        });
        const form = new form_data_1.default();
        form.append('forecastZip', fs_1.default.createReadStream(zipPath));
        const uploadTarget = new URL('/forecast/upload', configs_1.config.warroom.url)
            .href;
        await axios_1.default.post(uploadTarget, form, {
            headers: {
                ...form.getHeaders(),
                'x-api-key': configs_1.config.warroom.apiKey, // ใช้ API Key ที่คุยกันไว้
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 600000, // 10 นาที
        });
    }
    catch (error) {
        const errorMsg = error.response?.data?.message || error.message;
        console.error('Upload failed:', errorMsg);
        throw new Error(errorMsg);
    }
    finally {
        if (fs_1.default.existsSync(zipPath)) {
            fs_1.default.unlinkSync(zipPath);
        }
    }
}
//# sourceMappingURL=worker.js.map