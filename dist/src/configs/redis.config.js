"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConfig = void 0;
const env_util_1 = require("../shared/utils/env.util");
const REDIS_HOST = '127.0.0.1';
const REDIS_PORT = (0, env_util_1.getEnv)('REDIS_PORT');
const REDIS_URL = `redis://:@${REDIS_HOST}:${REDIS_PORT}`;
exports.redisConfig = {
    url: REDIS_URL,
};
//# sourceMappingURL=redis.config.js.map