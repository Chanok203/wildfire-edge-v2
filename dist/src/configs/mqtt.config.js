"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqttConfig = void 0;
const env_util_1 = require("../shared/utils/env.util");
exports.mqttConfig = {
    url: (0, env_util_1.getEnv)("MQTT_URL")
};
//# sourceMappingURL=mqtt.config.js.map