"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRecording = exports.getSensorStatus = exports.getCSVList = exports.getWindDataList = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const configs_1 = require("../../configs");
const wind_service_1 = require("../../modules/wind/wind.service");
const redis_lib_1 = require("../../shared/libs/redis.lib");
const socketio_lib_1 = require("../../shared/libs/socketio.lib");
const error_utils_1 = require("../../shared/utils/error.utils");
const windService = new wind_service_1.WindService();
const getWindDataList = async (req, res) => {
    const { draw, start, length, search, order, columns } = req.body;
    const sortColumnIndex = order?.[0]?.column;
    const sortDir = order?.[0]?.dir;
    const sortField = columns?.[sortColumnIndex]?.data || 'createdAt';
    const limit = Number(length) || 10;
    const page = Number(start) / limit + 1;
    const { items, total, filterd } = await windService.findAllForDataTable(page, limit, sortField, sortDir, search.value);
    res.json({
        draw: Number(draw),
        recordsTotal: total,
        recordsFiltered: filterd,
        data: items,
    });
};
exports.getWindDataList = getWindDataList;
const getCSVList = async (req, res) => {
    const { draw, start, length, search, order, columns } = req.body;
    const dir = configs_1.config.app.windDir;
    const files = (0, fs_1.readdirSync)(dir)
        .filter((file) => file.endsWith('.csv') && search ? true : file.includes(search))
        .map((file) => {
        const stats = (0, fs_1.statSync)(path_1.default.join(dir, file));
        return {
            name: file,
            size: (stats.size / 1024).toFixed(2) + ' KB',
            createdAt: stats.birthtime,
        };
    })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    res.json({
        draw: Number(draw),
        recordsTotal: files.length,
        recordsFiltered: files.length,
        data: files,
    });
};
exports.getCSVList = getCSVList;
const getSensorStatus = async (req, res) => {
    const status = await redis_lib_1.redis.get(`wildfire:sensor:status`);
    res.json({
        status: 'success',
        data: {
            status,
        },
    });
};
exports.getSensorStatus = getSensorStatus;
const setRecording = async (req, res) => {
    const { isRecording } = req.body;
    if (typeof isRecording !== 'boolean') {
        throw new error_utils_1.BadRequestError(`"isRecording" ต้องเป็น boolean`);
    }
    await redis_lib_1.redis.set('wildfire:recording:status', String(isRecording));
    socketio_lib_1.socketLib.emit('wind:recording:update', isRecording);
    res.json({
        status: 'success',
        data: {
            isRecording,
            message: isRecording ? "เริ่มการบันทึกข้อมูล" : "หยุดการบันทึกข้อมูล"
        },
    });
};
exports.setRecording = setRecording;
//# sourceMappingURL=wind.api-controller.js.map