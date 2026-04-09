import { getEnv } from '@/shared/utils/env.util';

export const mediamtxConfig = {
    url: getEnv("MEDIA_MTX_URL")
} as const;
