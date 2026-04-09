import { RedisStore } from 'connect-redis';
import session from 'express-session';

import { config } from '@/configs';
import { redis } from '@/shared/libs/redis.lib';

const sessionStore = new RedisStore({
    client: redis,
    prefix: 'sess:',
});

export const sessionConfig = session({
    store: sessionStore,
    secret: config.app.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: config.app.isProd,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
    },
});
