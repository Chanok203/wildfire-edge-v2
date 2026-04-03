import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';

import { app } from '@/app';
import { config } from '@/configs';
import { initWindSensorMQTT } from '@/modules/wind_sensor/wind_sensor.mqtt';
import { mqttLib } from '@/shared/libs/mqtt.lib';
import { socketLib } from '@/shared/libs/socketio.lib';

const httpServer = http.createServer(app);

socketLib.init(httpServer);
mqttLib.connect(config.mqtt.url);

initWindSensorMQTT();

const { port, host } = config.app;
httpServer.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});
