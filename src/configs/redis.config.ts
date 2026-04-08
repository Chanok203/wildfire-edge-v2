import { getEnv } from '@/shared/utils/env.util';

const REDIS_HOST = '127.0.0.1';
const REDIS_PORT = getEnv('REDIS_PORT');

const REDIS_URL = `redis://:@${REDIS_HOST}:${REDIS_PORT}`;

export const redisConfig = {
    url: REDIS_URL,
} as const;
