import { appConfig } from '@/configs/app.config';
import { dbConfig } from '@/configs/db.config';
import { mqttConfig } from '@/configs/mqtt.config';
import { redisConfig } from '@/configs/redis.config';

export const config = {
    app: appConfig,
    db: dbConfig,
    redis: redisConfig,
    mqtt: mqttConfig,
} as const;
