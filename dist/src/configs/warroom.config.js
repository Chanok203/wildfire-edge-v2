"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warroomConfig = void 0;
const env_util_1 = require("../shared/utils/env.util");
exports.warroomConfig = {
    url: (0, env_util_1.getEnv)('WAR_ROOM_URL'),
    apiKey: (0, env_util_1.getEnv)('API_KEY'),
};
//# sourceMappingURL=warroom.config.js.map