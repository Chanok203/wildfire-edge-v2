import IORedis from 'ioredis';

import { config } from '@/configs';

export const redisConnection = new IORedis(config.redis.url);

redisConnection.on('error', (error) => {
    console.error('Redis Connection Error');
    console.error(`Message: ${error.message}`);
    process.exit(1);
});

redisConnection.on('connect', () => {
    console.log(`Redis Connected: OK`);
});
