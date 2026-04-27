import { Queue } from 'bullmq';

import { redis } from '@/shared/libs/redis.lib';

const commonDefaultOptions = {
    removeOnComplete: {
        age: 3600, // เก็บประวัติไว้ดู 1 ชม. แล้วลบ
        count: 100, // หรือเก็บไว้แค่ 100 งานล่าสุด
    },
    removeOnFail: {
        age: 24 * 3600, // งานที่พังเก็บไว้ดูได้ 24 ชม.
    },
};

export const aiQueue = new Queue('aiQueue', {
    connection: redis,
    defaultJobOptions: commonDefaultOptions,
});

export const pushQueue = new Queue('pushQueue', {
    connection: redis,
    defaultJobOptions: {
        attempts: 1,
        backoff: {
            type: 'fixed',
            delay: 5000,
        },
        ...commonDefaultOptions,
    },
});
