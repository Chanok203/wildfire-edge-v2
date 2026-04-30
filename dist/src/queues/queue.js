"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushQueue = exports.aiQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_lib_1 = require("../shared/libs/redis.lib");
const commonDefaultOptions = {
    removeOnComplete: {
        age: 3600, // เก็บประวัติไว้ดู 1 ชม. แล้วลบ
        count: 100, // หรือเก็บไว้แค่ 100 งานล่าสุด
    },
    removeOnFail: {
        age: 24 * 3600, // งานที่พังเก็บไว้ดูได้ 24 ชม.
    },
};
exports.aiQueue = new bullmq_1.Queue('aiQueue', {
    connection: redis_lib_1.redis,
    defaultJobOptions: commonDefaultOptions,
});
exports.pushQueue = new bullmq_1.Queue('pushQueue', {
    connection: redis_lib_1.redis,
    defaultJobOptions: {
        attempts: 1,
        backoff: {
            type: 'fixed',
            delay: 5000,
        },
        ...commonDefaultOptions,
    },
});
//# sourceMappingURL=queue.js.map