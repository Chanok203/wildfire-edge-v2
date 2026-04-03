import { WindSensorService } from '@/modules/wind_sensor/wind_sensor.service';
import { mqttLib } from '@/shared/libs/mqtt.lib';

export const initWindSensorMQTT = () => {
    const service = new WindSensorService();

    mqttLib.client?.subscribe('wind_data');

    mqttLib.client?.on('message', (topic, message) => {
        if (topic !== 'wind_data') {
            return;
        }

        const data = JSON.parse(message.toString());
        service.handleIncomingData(data);
    });
};
