"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstanceList = void 0;
const hotspot_manager_service_1 = require("../../modules/hotspot-manager/hotspot-manager.service");
const hotspotManagerService = new hotspot_manager_service_1.HotspotManagerService();
const getInstanceList = async (req, res) => {
    const items = await hotspotManagerService.getList();
    res.json({ data: items });
};
exports.getInstanceList = getInstanceList;
//# sourceMappingURL=hotspot-manager.api-controller.js.map