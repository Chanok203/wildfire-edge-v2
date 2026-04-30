"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCSV = exports.downloadCSV = exports.renderCSVHistory = exports.exportAndDelete = exports.exportToCSV = exports.renderListWindData = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const configs_1 = require("../../configs");
const wind_service_1 = require("../../modules/wind/wind.service");
const redis_lib_1 = require("../../shared/libs/redis.lib");
const csv_util_1 = require("../../shared/utils/csv.util");
const error_utils_1 = require("../../shared/utils/error.utils");
const entity = 'wind';
const windService = new wind_service_1.WindService();
const renderListWindData = async (req, res) => {
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);
    lastMonth.setHours(0, 0, 0, 0);
    const format = (d) => {
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().slice(0, 16);
    };
    const sensorStatus = await redis_lib_1.redis.get('wildfire:sensor:status');
    const isRecording = (await redis_lib_1.redis.get('wildfire:recording:status')) === 'true';
    res.render('wind/wind-list.html', {
        entity,
        defaultBegin: format(lastMonth),
        defaultEnd: format(now),
        isRecording: isRecording,
        sensorStatus: sensorStatus,
    });
};
exports.renderListWindData = renderListWindData;
const exportToCSV = async (req, res) => {
    const { beginDate, endDate } = req.body;
    const startUTC = new Date(beginDate);
    const endUTC = new Date(endDate);
    const data = await windService.filterByDate(startUTC, endUTC);
    const csv = await (0, csv_util_1.toCSV)(data);
    const format = (d) => d.replace(/[:T]/g, '').replace(/-/g, '').slice(0, 13);
    const startName = format(beginDate);
    const endName = format(endDate);
    const filename = `wind_${startName}_to_${endName}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send('\ufeff' + csv);
};
exports.exportToCSV = exportToCSV;
const exportAndDelete = async (req, res) => {
    const { beginDate, endDate } = req.body;
    const startUTC = new Date(beginDate);
    const endUTC = new Date(endDate);
    const data = await windService.filterByDate(startUTC, endUTC);
    const csv = await (0, csv_util_1.toCSV)(data);
    const format = (d) => d.replace(/[:T]/g, '').replace(/-/g, '').slice(0, 13);
    const startName = format(beginDate);
    const endName = format(endDate);
    const filename = `wind_${startName}_to_${endName}.csv`;
    const dir = configs_1.config.app.windDir;
    const filepath = path_1.default.join(dir, filename);
    (0, fs_1.writeFileSync)(filepath, '\ufeff' + csv, 'utf-8');
    await windService.deleteByDate(startUTC, endUTC);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send('\ufeff' + csv);
};
exports.exportAndDelete = exportAndDelete;
const renderCSVHistory = async (req, res) => {
    res.render('wind/wind-csv-history.html', { entity });
};
exports.renderCSVHistory = renderCSVHistory;
const downloadCSV = async (req, res) => {
    const { filename } = req.params;
    const filepath = path_1.default.join(configs_1.config.app.windDir, filename);
    if (!(0, fs_1.existsSync)(filepath)) {
        throw new error_utils_1.NotFoundError(`FILE NOT FOUND: ${filename}`);
    }
    res.download(filepath);
};
exports.downloadCSV = downloadCSV;
const deleteCSV = async (req, res) => {
    const { filename } = req.params;
    const filepath = path_1.default.join(configs_1.config.app.windDir, filename);
    if (!(0, fs_1.existsSync)(filepath)) {
        throw new error_utils_1.NotFoundError(`FILE NOT FOUND: ${filename}`);
    }
    (0, fs_1.unlinkSync)(filepath);
    req.flash('success', `คุณลบไฟล์ ${filename} สำเร็จแล้ว`);
    res.redirect('/wind/csv-history');
};
exports.deleteCSV = deleteCSV;
//# sourceMappingURL=wind.controller.js.map