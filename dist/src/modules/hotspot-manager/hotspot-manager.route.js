"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotspotManagerApiRouter = exports.hotspotManagerRouter = void 0;
const express_1 = require("express");
const apiController = __importStar(require("../hotspot-manager/hotspot-manager.api-controller"));
const controller = __importStar(require("../hotspot-manager/hotspot-manager.controller"));
const router = (0, express_1.Router)();
exports.hotspotManagerRouter = router;
router.get('/', controller.renderInstanceList);
router.post('/create', controller.handleCreateInstance);
router.post('/delete-all', controller.handleDeleteAllInstances);
router.post('/:droneId/delete', controller.handleDeleteInstance);
router.get('/:droneId/player', controller.renderInstancePlayer);
router.post('/:droneId/extend-time', controller.handleExtendTime);
const apiRouter = (0, express_1.Router)();
exports.hotspotManagerApiRouter = apiRouter;
apiRouter.post('/', apiController.getInstanceList);
//# sourceMappingURL=hotspot-manager.route.js.map