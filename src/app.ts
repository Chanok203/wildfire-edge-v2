import express from 'express';
import path from 'path';

import cors from 'cors';
import morgan from 'morgan';
import nunjucks from 'nunjucks';

import { config } from '@/configs';
import { homeRouter } from '@/modules/home/home.route';
import { windSensorRouter } from '@/modules/wind_sensor/wind_sensor.route';

export const app = express();

nunjucks.configure(path.join(__dirname, '..', 'views'), {
    express: app,
    autoescape: true,
    noCache: config.app.isDev,
});

app.use(cors());
app.use(morgan(config.app.isDev ? 'dev' : 'combined'));

app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.use('/', homeRouter);
app.use('/wind-sensor', windSensorRouter);
