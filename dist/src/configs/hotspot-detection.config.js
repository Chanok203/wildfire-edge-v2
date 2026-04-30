"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotspotDetectionConfig = void 0;
const env_util_1 = require("../shared/utils/env.util");
exports.hotspotDetectionConfig = {
    url: (0, env_util_1.getEnv)("HOTSPOT_DETECTION_URL")
};
//# sourceMappingURL=hotspot-detection.config.js.map