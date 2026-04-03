"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const env_util_1 = require("../utils/env.util");
const env = (0, env_util_1.getEnv)("NODE_ENV");
exports.appConfig = {
    host: (0, env_util_1.getEnv)('HOST'),
    port: Number((0, env_util_1.getEnv)('PORT')),
    isDev: env === 'development',
    isProd: env === 'production',
};
//# sourceMappingURL=app.config.js.map