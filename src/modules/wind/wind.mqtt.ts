import { WindService } from '@/modules/wind/wind.service';
import { mqttLib } from '@/shared/libs/mqtt.lib';

export const initWindSensorMQTT = () => {
    const service = new WindService();

    mqttLib.client?.subscribe('wind_data');

    mqttLib.client?.on('message', (topic, message) => {
        if (topic !== 'wind_data') {
            return;
        }

        const data = JSON.parse(message.toString());
        service.handleIncomingData(data);
    });
};
