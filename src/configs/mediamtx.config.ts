import { getEnv } from '@/shared/utils/env.util';

export const mediamtxConfig = {
    api: getEnv('MEDIA_MTX_URL'),
    rtsp: getEnv('MEDIA_MTX_RTSP'),
} as const;
