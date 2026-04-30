"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleExtendTime = exports.handleDeleteAllInstances = exports.handleDeleteInstance = exports.renderInstancePlayer = exports.handleCreateInstance = exports.renderInstanceList = void 0;
const configs_1 = require("../../configs");
const drone_service_1 = require("../../modules/drones/drone.service");
const hotspot_manager_service_1 = require("../../modules/hotspot-manager/hotspot-manager.service");
const entity = 'hotspot-manager';
const droneService = new drone_service_1.DroneService();
const hotspotManagerService = new hotspot_manager_service_1.HotspotManagerService();
const renderInstanceList = async (req, res) => {
    const droneList = await droneService.getDroneList();
    res.render('hotspot-manager/hotspot-manager-list.html', {
        entity,
        droneList,
    });
};
exports.renderInstanceList = renderInstanceList;
const handleCreateInstance = async (req, res) => {
    const { droneId } = req.body;
    const input_url = `${configs_1.config.mediamtx.rtsp}/${droneId}`;
    const output_url = `${configs_1.config.mediamtx.rtsp}/AI/${droneId}`;
    const created = await hotspotManagerService.create(droneId, input_url, output_url);
    if (created) {
        req.flash('success', `คุณสร้างตัวตรวจจับหัวไฟสำเร็จ (${droneId})`);
    }
    else {
        req.flash('danger', `คุณสร้างตัวตรวจจับหัวไฟไม่สำเร็จ (${droneId})`);
    }
    res.redirect('/hotspot-manager/');
};
exports.handleCreateInstance = handleCreateInstance;
const renderInstancePlayer = async (req, res) => {
    const { droneId } = req.params;
    res.render('hotspot-manager/hotspot-manager-player.html', {
        entity,
        droneId,
        src: `http://${configs_1.config.app.publicIp}:8889/AI/${droneId}`,
    });
};
exports.renderInstancePlayer = renderInstancePlayer;
const handleDeleteInstance = async (req, res) => {
    const droneId = req.params.droneId;
    const deleted = await hotspotManagerService.deleteById(droneId);
    if (deleted) {
        req.flash('success', `คุณลบตัวตรวจจับหัวไฟแล้ว (${droneId})`);
    }
    else {
        req.flash('danger', `คุณลบตัวตรวจจับหัวไฟไม่สำเร็จ (${droneId})`);
    }
    res.redirect('/hotspot-manager/');
};
exports.handleDeleteInstance = handleDeleteInstance;
const handleDeleteAllInstances = async (req, res) => {
    const deleted = await hotspotManagerService.deleteAll();
    if (deleted) {
        req.flash('success', 'คุณลบตัวตรวจจับหัวไฟทั้งหมดแล้ว');
    }
    else {
        req.flash('danger', 'คุณลบตัวตรวจจับหัวไฟไม่สำเร็จ');
    }
    res.redirect('/hotspot-manager/');
};
exports.handleDeleteAllInstances = handleDeleteAllInstances;
const handleExtendTime = async (req, res) => {
    const droneId = req.params.droneId;
    const extended = await hotspotManagerService.extendTimeById(droneId);
    if (extended) {
        req.flash('success', `คุณต่อเวลาให้ตัวตรวจจับหัวไฟแล้ว (${droneId})`);
    }
    else {
        req.flash('danger', `คุณต่อเวลาให้ตัวตรวจจับหัวไฟไม่สำเร็จ (${droneId})`);
    }
    res.redirect('/hotspot-manager/');
};
exports.handleExtendTime = handleExtendTime;
//# sourceMappingURL=hotspot-manager.controller.js.map