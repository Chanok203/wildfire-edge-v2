"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const app_config_1 = require("../configs/app.config");
const db_config_1 = require("../configs/db.config");
const forecast_config_1 = require("../configs/forecast.config");
const hotspot_detection_config_1 = require("../configs/hotspot-detection.config");
const mediamtx_config_1 = require("../configs/mediamtx.config");
const mqtt_config_1 = require("../configs/mqtt.config");
const redis_config_1 = require("../configs/redis.config");
const warroom_config_1 = require("../configs/warroom.config");
exports.config = {
    app: app_config_1.appConfig,
    db: db_config_1.dbConfig,
    redis: redis_config_1.redisConfig,
    mqtt: mqtt_config_1.mqttConfig,
    mediamtx: mediamtx_config_1.mediamtxConfig,
    hotspotDetection: hotspot_detection_config_1.hotspotDetectionConfig,
    forecast: forecast_config_1.forecastConfig,
    warroom: warroom_config_1.warroomConfig,
};
//# sourceMappingURL=index.js.map