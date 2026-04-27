import { z } from 'zod';

// กำหนดกฎการตรวจสอบ (Schema)
export const ForecastSchema = z.object({
    forecastName: z.string().min(1),
    droneId: z.string().min(1),

    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    windSpeed: z.coerce.number().min(0).max(150),
    windDirection: z.coerce.number().min(0).max(359.99),
});
export type ForecastInput = z.infer<typeof ForecastSchema>;

export const ForecastConfirmSchema = ForecastSchema.extend({
    snapshot: z.string().min(1, "ต้องมีไฟล์ภาพ snapshot ส่งมาด้วย"),
});
export type ForecastConfirmInput = z.infer<typeof ForecastConfirmSchema>;