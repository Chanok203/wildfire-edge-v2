"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeRouter = void 0;
const home_controller_1 = require("../../modules/home/home.controller");
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.homeRouter = router;
router.get('/', home_controller_1.homeView);
//# sourceMappingURL=home.route.js.map