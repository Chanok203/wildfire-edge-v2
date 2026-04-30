"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const configs_1 = require("../../configs");
exports.redis = new ioredis_1.default(configs_1.config.redis.url, {
    maxRetriesPerRequest: null,
});
exports.redis.on('error', (error) => {
    console.error('[Redis] Connection: Error');
    console.error(`Message: ${error.message}`);
    process.exit(1);
});
exports.redis.on('connect', () => {
    console.log(`[Redis] Connection: OK`);
});
//# sourceMappingURL=redis.lib.js.map