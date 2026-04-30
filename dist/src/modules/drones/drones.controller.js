"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderDronePlayer = exports.renderDroneList = void 0;
const configs_1 = require("../../configs");
const entity = 'drones';
const renderDroneList = (req, res) => {
    res.render('drones/drones-list.html', { entity });
};
exports.renderDroneList = renderDroneList;
const renderDronePlayer = (req, res) => {
    const { droneId } = req.params;
    res.render('drones/drones-player.html', {
        entity,
        droneId,
        src: `http://${configs_1.config.app.publicIp}:8889/${droneId}`,
    });
};
exports.renderDronePlayer = renderDronePlayer;
//# sourceMappingURL=drones.controller.js.map