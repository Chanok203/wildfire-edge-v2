"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const configs_1 = require("./configs");
const home_route_1 = require("./modules/home/home.route");
exports.app = (0, express_1.default)();
nunjucks_1.default.configure(path_1.default.join(__dirname, '..', 'views'), {
    noCache: true,
    autoescape: true,
    express: exports.app,
});
exports.app.use((0, cors_1.default)());
exports.app.use((0, morgan_1.default)(configs_1.config.app.isDev ? 'dev' : 'combined'));
exports.app.use('/', home_route_1.homeRouter);
//# sourceMappingURL=app.js.map