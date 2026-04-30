"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forecastConfig = void 0;
const env_util_1 = require("../shared/utils/env.util");
exports.forecastConfig = {
    url: (0, env_util_1.getEnv)('FORECASE_URL'),
};
//# sourceMappingURL=forecast.config.js.map