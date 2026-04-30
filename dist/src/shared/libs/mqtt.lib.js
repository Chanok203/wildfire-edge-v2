"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqttLib = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
class MqttLib {
    client = null;
    connect(url) {
        this.client = mqtt_1.default.connect(url);
        this.client.on('connect', () => {
            console.log(`[MQTT] Connection: OK`);
        });
        this.client.on('error', (error) => {
            console.error(`[MQTT] Connection error: ${error}`);
        });
    }
}
exports.mqttLib = new MqttLib();
//# sourceMappingURL=mqtt.lib.js.map