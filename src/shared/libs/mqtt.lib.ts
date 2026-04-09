import mqtt from "mqtt";

class MqttLib {
    public client: mqtt.MqttClient | null = null

    connect(url: string) {
        this.client = mqtt.connect(url)
        this.client.on('connect', () => {
            console.log(`[MQTT] Connection: OK`)
        });
        this.client.on('error', (error) => {
            console.error(`[MQTT] Connection error: ${error}`);
        });
    }
}

export const mqttLib = new MqttLib();
