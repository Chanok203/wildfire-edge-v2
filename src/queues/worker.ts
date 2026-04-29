import fs from 'fs';
import path from 'path';

import { Prisma } from '@generated/prisma/client';
import { AIStatus, PushStatus } from '@generated/prisma/enums';
import archiver from 'archiver';
import axios from 'axios';
import { Job, Worker } from 'bullmq';
import FormData from 'form-data';

import { config } from '@/configs';
import { pushQueue } from '@/queues/queue';
import { prisma } from '@/shared/libs/prisma.lib';
import { redis } from '@/shared/libs/redis.lib';
import { sleep } from '@/shared/utils/sleep.util';

export const initWorker = () => {
    const aiWorker = new Worker(
        'aiQueue',
        async (job: Job) => {
            const { id, dir } = job.data;
            console.log(`[AI] Starting: ${id}`);
            try {
                await prisma.forecast.update({
                    where: { id },
                    data: { aiStatus: AIStatus.PROCESSING },
                });

                const forecast = await prisma.forecast.findUnique({
                    where: { id },
                });
                if (!forecast || !forecast.inputData) {
                    throw new Error(`[AI Worker] forecast not found (${id})`);
                }

                const inputData = forecast.inputData as {
                    forecastId: string;
                    forecastName: string;
                    droneId: string;
                    latitude: number;
                    longitude: number;
                    windSpeed: number;
                    windDirection: number;
                    bboxes: object;
                };

                const predictUrl = `${config.forecast.url}/predict`;
                const data = {
                    lat: inputData.latitude,
                    lon: inputData.longitude,
                    wind_speed_mps: inputData.windSpeed,
                    wind_direction_deg: inputData.windDirection,
                    prediction_minutes: '5,10,15',
                };
                const response = await axios.post(predictUrl, data);
                const jobId = response.data.id;

                // wait for result
                const interval = 5;
                const total = 300;
                const maxRetry = total / interval;
                let retry = 0;

                const jobUrl = `${config.forecast.url}/jobs/${jobId}`;
                let job;
                while (retry < maxRetry) {
                    const res = await axios.get(jobUrl, { timeout: 10000 });
                    job = res.data;

                    if (job.status === 'failed') {
                        throw new Error(`[AI Worker] forecast failed (${id})`);
                    }

                    if (job.status === 'completed') {
                        break;
                    }

                    retry++;
                    await sleep(interval);
                }

                const geojson = job.prediction_geojson_data;
                if (!job || !geojson) {
                    throw new Error(`[AI Worker] forecast failed (${id})`);
                }

                fs.writeFileSync(
                    path.join(dir, 'output', 'result.json'),
                    JSON.stringify(geojson, null, 2),
                );

                if (geojson && geojson.length > 0) {
                    const results: Prisma.ForecastResultCreateManyInput[] = (
                        geojson as any[]
                    ).map((item) => {
                        const match = item.filename.match(/_(\d+)min/);

                        const forecastId = forecast.id;
                        const filename = item.filename as string;
                        const minutes: number = Number(match[1]);
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
                    await prisma.$transaction([
                        prisma.forecastResult.deleteMany({
                            where: { forecastId: forecast.id },
                        }),
                        prisma.forecastResult.createMany({
                            data: results,
                        }),
                    ]);
                }

                await prisma.forecast.update({
                    where: { id },
                    data: { aiStatus: AIStatus.COMPLETED },
                });
                await pushQueue.add('pushQueue', { id: forecast.id });
                // Call pushQueue
            } catch (error) {
                await prisma.forecast.update({
                    where: { id },
                    data: { aiStatus: AIStatus.FAILED },
                });
                console.error(error);
                throw error;
            }
        },
        {
            connection: redis,
            concurrency: 1,
        },
    );

    const pushWorker = new Worker(
        'pushQueue',
        async (job: Job) => {
            const { id } = job.data;
            console.log(`[PUSH] Starting: ${id}`);
            try {
                await prisma.forecast.update({
                    where: { id },
                    data: { pushStatus: PushStatus.PUSHING },
                });

                await zipAndUpload(id);

                await prisma.forecast.update({
                    where: { id },
                    data: { pushStatus: PushStatus.PUSHED },
                });
            } catch (error) {
                await prisma.forecast.update({
                    where: { id },
                    data: { pushStatus: PushStatus.FAILED },
                });
                console.error(error);
                throw error;
            }
        },
        {
            connection: redis,
            concurrency: 1,
        },
    );
};

async function zipAndUpload(id: string) {
    const dir = path.join(config.app.forecastDir, id);
    const zipPath = path.join(config.app.forecastDir, `${id}.zip`);

    try {
        await new Promise<void>((resolve, reject) => {
            const output = fs.createWriteStream(zipPath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => resolve());
            archive.on('error', (err) => reject(err));

            archive.pipe(output);
            archive.directory(dir, false);
            archive.finalize();
        });

        const form = new FormData();
        form.append('forecastZip', fs.createReadStream(zipPath));
        const uploadTarget = new URL('/forecast/upload', config.warroom.url)
            .href;
        await axios.post(uploadTarget, form, {
            headers: {
                ...form.getHeaders(),
                'x-api-key': config.warroom.apiKey, // ใช้ API Key ที่คุยกันไว้
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 600000, // 10 นาที
        });
    } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.message;
        console.error('Upload failed:', errorMsg);
        throw new Error(errorMsg);
    } finally {
        if (fs.existsSync(zipPath)) {
            fs.unlinkSync(zipPath);
        }
    }
}
