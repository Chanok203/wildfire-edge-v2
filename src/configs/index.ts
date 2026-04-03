import { appConfig } from '@/configs/app.config';
import { dbConfig } from '@/configs/db.config';
import { mqttConfig } from '@/configs/mqtt.config';

export const config = {
    app: appConfig,
    db: dbConfig,
    mqtt: mqttConfig,
} as const;
