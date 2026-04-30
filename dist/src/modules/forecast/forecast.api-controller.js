"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getForecastForMap = exports.getForecastList = exports.getForcast = exports.createForcast = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const forecast_service_1 = require("../../modules/forecast/forecast.service");
const queue_1 = require("../../queues/queue");
const base64_to_image_util_1 = require("../../shared/utils/base64-to-image.util");
const forecastService = new forecast_service_1.ForecastService();
const createForcast = async (req, res) => {
    const { originalImage, detectedImage, ...inputData } = req.body;
    try {
        const forecastId = `forecast_${(0, uuid_1.v4)()}`;
        const { dir, inputDir, outputDir } = await forecastService.prepareFolder(forecastId);
        (0, base64_to_image_util_1.writeBase64ToFile)(originalImage, path_1.default.join(inputDir, 'original.jpg'));
        (0, base64_to_image_util_1.writeBase64ToFile)(detectedImage, path_1.default.join(inputDir, 'detected.jpg'));
        await promises_1.default.writeFile(path_1.default.join(inputDir, 'detection-response.json'), JSON.stringify(inputData, null, 2), 'utf-8');
        const forecast = await forecastService.create(forecastId, inputData);
        queue_1.aiQueue.add(`aiQueue`, {
            id: forecast.id,
            dir: dir,
        });
        res.json({
            status: 'success',
            data: {
                forecast: { id: forecast.id },
            },
        });
    }
    catch (error) {
        console.error(error);
        res.json({ status: 'error', message: 'ไม่สามารถสร้างการทำนายได้' });
    }
};
exports.createForcast = createForcast;
const getForcast = async (req, res) => {
    const forecastId = req.params.forecastId;
    try {
        const forecast = await forecastService.getById(forecastId);
        if (!forecast) {
            return res.status(404).json({
                status: 'fail',
                data: 'Not Found',
            });
        }
        res.json({
            status: 'success',
            data: { forecast },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
};
exports.getForcast = getForcast;
const getForecastList = async (req, res) => {
    const { draw, start, length, search, order, columns } = req.body;
    const sortColumnIndex = order?.[0]?.column;
    const sortDir = order?.[0]?.dir;
    const sortField = columns?.[sortColumnIndex]?.data || 'createdAt';
    const limit = Number(length) || 10;
    const page = Number(start) / limit + 1;
    const { items, total, filterd } = await forecastService.findAllForDataTable(page, limit, sortField, sortDir, search.value);
    res.json({
        draw: Number(draw),
        recordsTotal: total,
        recordsFiltered: filterd,
        data: items,
    });
};
exports.getForecastList = getForecastList;
const getForecastForMap = async (req, res) => {
    const forecastId = req.params.forecastId;
    try {
        const forecast = await forecastService.getById(forecastId);
        if (!forecast) {
            return res.status(404).json({
                status: 'fail',
                data: 'Not Found',
            });
        }
        const { inputData, ...data } = forecast;
        res.json({
            status: 'success',
            data: { forecast: data },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
};
exports.getForecastForMap = getForecastForMap;
//# sourceMappingURL=forecast.api-controller.js.map