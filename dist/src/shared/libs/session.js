"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionConfig = void 0;
const connect_redis_1 = require("connect-redis");
const express_session_1 = __importDefault(require("express-session"));
const configs_1 = require("../../configs");
const redis_lib_1 = require("../../shared/libs/redis.lib");
const sessionStore = new connect_redis_1.RedisStore({
    client: redis_lib_1.redis,
    prefix: 'sess:',
});
exports.sessionConfig = (0, express_session_1.default)({
    store: sessionStore,
    secret: configs_1.config.app.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: configs_1.config.app.isProd,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
    },
});
//# sourceMappingURL=session.js.map