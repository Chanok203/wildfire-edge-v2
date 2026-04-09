import IORedis from 'ioredis';

import { config } from '@/configs';

export const redis = new IORedis(config.redis.url);

redis.on('error', (error) => {
    console.error('[Redis] Connection: Error');
    console.error(`Message: ${error.message}`);
    process.exit(1);
});

redis.on('connect', () => {
    console.log(`[Redis] Connected: OK`);
});
