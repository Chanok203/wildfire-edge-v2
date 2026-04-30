"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediamtxConfig = void 0;
const env_util_1 = require("../shared/utils/env.util");
exports.mediamtxConfig = {
    api: (0, env_util_1.getEnv)('MEDIA_MTX_URL'),
    rtsp: (0, env_util_1.getEnv)('MEDIA_MTX_RTSP'),
};
//# sourceMappingURL=mediamtx.config.js.map