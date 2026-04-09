import { WindService } from '@/modules/wind/wind.service';
import { mqttLib } from '@/shared/libs/mqtt.lib';
import { redis } from '@/shared/libs/redis.lib';

export const initWindSensorMQTT = async () => {
    const service = new WindService();
    const TOPIC = 'wind_data';
    await redis.set('wildfire:recording:status', 'false');

    mqttLib.client?.subscribe(TOPIC);

    mqttLib.client?.on('message', async (topic, message) => {
        if (topic !== TOPIC) return;
        try {
            await redis.setex('wildfire:sensor:status', 15, 'connected');
            const isRecording = await redis.get('wildfire:recording:status');
            const doSave = isRecording === 'true';
            const data = JSON.parse(message.toString());
            service.handleIncomingData(data, doSave);
        } catch (error) {
            console.error(`[MQTT] Error: ${error}`);
        }
    });
};
