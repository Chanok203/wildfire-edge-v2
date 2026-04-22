import { getEnv } from '@/shared/utils/env.util';

export const forecastConfig = {
    url: getEnv('FORECASE_URL'),
} as const;
