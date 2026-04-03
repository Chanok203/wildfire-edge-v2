import { getEnv } from '@/shared/utils/env.util';

const env = getEnv('NODE_ENV');

export const appConfig = {
    host: getEnv('HOST'),
    port: Number(getEnv('PORT')),
    isDev: env === 'development',
    isProd: env === 'production',
} as const;
