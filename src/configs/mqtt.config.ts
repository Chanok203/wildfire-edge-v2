import { getEnv } from '@/shared/utils/env.util';

export const mqttConfig = {
    url: getEnv("MQTT_URL")
} as const;
