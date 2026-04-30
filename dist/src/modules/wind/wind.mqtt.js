"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWindSensorMQTT = void 0;
const wind_service_1 = require("../../modules/wind/wind.service");
const mqtt_lib_1 = require("../../shared/libs/mqtt.lib");
const redis_lib_1 = require("../../shared/libs/redis.lib");
const initWindSensorMQTT = async () => {
    const service = new wind_service_1.WindService();
    const TOPIC = 'wind_data';
    await redis_lib_1.redis.set('wildfire:recording:status', 'false');
    mqtt_lib_1.mqttLib.client?.subscribe(TOPIC);
    mqtt_lib_1.mqttLib.client?.on('message', async (topic, message) => {
        if (topic !== TOPIC)
            return;
        try {
            await redis_lib_1.redis.setex('wildfire:sensor:status', 15, 'connected');
            const isRecording = await redis_lib_1.redis.get('wildfire:recording:status');
            const doSave = isRecording === 'true';
            const data = JSON.parse(message.toString());
            service.handleIncomingData(data, doSave);
        }
        catch (error) {
            console.error(`[MQTT] Error: ${error}`);
        }
    });
};
exports.initWindSensorMQTT = initWindSensorMQTT;
//# sourceMappingURL=wind.mqtt.js.map