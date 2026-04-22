import { appConfig } from '@/configs/app.config';
import { dbConfig } from '@/configs/db.config';
import { forecastConfig } from '@/configs/forecast.config';
import { hotspotDetectionConfig } from '@/configs/hotspot-detection.config';
import { mediamtxConfig } from '@/configs/mediamtx.config';
import { mqttConfig } from '@/configs/mqtt.config';
import { redisConfig } from '@/configs/redis.config';

export const config = {
    app: appConfig,
    db: dbConfig,
    redis: redisConfig,
    mqtt: mqttConfig,
    mediamtx: mediamtxConfig,
    hotspotDetection: hotspotDetectionConfig,
    forecast: forecastConfig,
} as const;
