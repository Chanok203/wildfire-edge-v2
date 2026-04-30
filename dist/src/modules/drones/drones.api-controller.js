"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDroneList = void 0;
const drone_service_1 = require("../../modules/drones/drone.service");
const droneService = new drone_service_1.DroneService();
const getDroneList = async (req, res) => {
    const items = await droneService.getDroneList();
    res.json({ data: items });
};
exports.getDroneList = getDroneList;
//# sourceMappingURL=drones.api-controller.js.map