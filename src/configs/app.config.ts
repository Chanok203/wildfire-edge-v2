import { existsSync, mkdirSync } from 'fs';
import path from 'path';

import { getEnv } from '@/shared/utils/env.util';

const env = getEnv('NODE_ENV');

export const appConfig = {
    publicIp: getEnv('PUBLIC_IP'),
    host: getEnv('HOST'),
    port: Number(getEnv('PORT')),
    secret: getEnv('SECRET'),
    isDev: env === 'development',
    isProd: env === 'production',
    csvDir: path.resolve(__dirname, '..', '..', 'media', 'csv'),
} as const;

if (!existsSync(appConfig.csvDir)) {
    mkdirSync(appConfig.csvDir, { recursive: true });
}
