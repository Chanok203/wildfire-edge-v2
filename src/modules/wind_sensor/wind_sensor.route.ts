import { listView } from '@/modules/wind_sensor/wind_sensor.controller';
import { Router } from 'express';

const router = Router();

router.get("/", listView);

export { router as windSensorRouter };
