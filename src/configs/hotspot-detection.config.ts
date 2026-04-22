import { getEnv } from '@/shared/utils/env.util';

export const hotspotDetectionConfig = {
    url: getEnv("HOTSPOT_DETECTION_URL")
} as const;
