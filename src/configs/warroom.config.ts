import { getEnv } from '@/shared/utils/env.util';

export const warroomConfig = {
    url: getEnv('WAR_ROOM_URL'),
    apiKey: getEnv('API_KEY'),
} as const;
