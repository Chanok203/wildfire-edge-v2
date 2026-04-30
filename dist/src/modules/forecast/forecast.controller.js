"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePush = exports.renderView = exports.handleForecastDelete = exports.handleForecastCreate = exports.renderForecastCreate = exports.renderForecastList = void 0;
const configs_1 = require("../../configs");
const drone_service_1 = require("../../modules/drones/drone.service");
const forecast_schema_1 = require("../../modules/forecast/forecast.schema");
const forecast_service_1 = require("../../modules/forecast/forecast.service");
const hotspot_manager_service_1 = require("../../modules/hotspot-manager/hotspot-manager.service");
const queue_1 = require("../../queues/queue");
const entity = 'forecast';
const droneService = new drone_service_1.DroneService();
const hotspotManagerService = new hotspot_manager_service_1.HotspotManagerService();
const forecastService = new forecast_service_1.ForecastService();
const renderForecastList = async (req, res) => {
    const droneList = await droneService.getDroneList();
    res.render('forecast/forecast-list.html', { entity, droneList });
};
exports.renderForecastList = renderForecastList;
const renderForecastCreate = async (req, res) => {
    const forecastName = req.query.name;
    const droneId = req.query.droneId;
    const src = `http://${configs_1.config.app.publicIp}:8889/AI/${droneId}`;
    const instance = await hotspotManagerService.getById(droneId);
    if (instance) {
        await hotspotManagerService.extendTimeById(droneId);
    }
    else {
        const input_url = `${configs_1.config.mediamtx.rtsp}/${droneId}`;
        const output_url = `${configs_1.config.mediamtx.rtsp}/AI/${droneId}`;
        const created = await hotspotManagerService.create(droneId, input_url, output_url);
        if (!created) {
            req.flash('danger', 'ไม่สามารถเริ่มการทำงานได้ โปรดตรวจสอบโดรน');
            return res.redirect('/forecast');
        }
    }
    res.render('forecast/forecast-create.html', {
        entity,
        forecastName,
        droneId,
        src,
    });
};
exports.renderForecastCreate = renderForecastCreate;
const handleForecastCreate = async (req, res) => {
    try {
        const input = forecast_schema_1.ForecastSchema.parse(req.body);
        const data = await hotspotManagerService.getAnalysis(input.droneId);
        if (!data) {
            throw new Error(`ไม่สามารถเตรียมได้`);
        }
        data.bboxes = JSON.stringify(data.bboxes, null, 2);
        res.render('forecast/forecast-confirm.html', {
            entity,
            data,
            ...input,
        });
    }
    catch (error) {
        console.error(error);
        req.flash('danger', 'ไม่สามารถเตรียมข้อมูลได้');
        res.redirect('/forecast');
    }
};
exports.handleForecastCreate = handleForecastCreate;
const handleForecastDelete = async (req, res) => {
    const { forecastId } = req.params;
    const forecast = await forecastService.deleteById(forecastId);
    req.flash('success', `คุณลบภารกิจ ${forecast.name} (${forecast.id}) สำเร็จแล้ว`);
    res.redirect(`/forecast`);
};
exports.handleForecastDelete = handleForecastDelete;
const renderView = async (req, res) => {
    const forecastId = req.query.forecastId || '';
    res.render('forecast/forecast-view.html', { entity, forecastId });
};
exports.renderView = renderView;
const handlePush = async (req, res) => {
    const forecastId = req.params.forecastId;
    const forecast = await forecastService.getById(forecastId);
    if (!forecast) {
        req.flash('danger', `คุณเริ่มนำส่งภารกิจไม่สำเร็จแล้ว`);
        return res.redirect(`/forecast`);
    }
    // TODO start push
    queue_1.pushQueue.add(`pushQueue`, { id: forecast.id });
    req.flash('success', `คุณเริ่มนำส่งภารกิจ ${forecast.name} (${forecast.id}) สำเร็จแล้ว`);
    res.redirect(`/forecast`);
};
exports.handlePush = handlePush;
//# sourceMappingURL=forecast.controller.js.map