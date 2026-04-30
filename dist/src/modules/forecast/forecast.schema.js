"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForecastConfirmSchema = exports.ForecastSchema = void 0;
const zod_1 = require("zod");
// กำหนดกฎการตรวจสอบ (Schema)
exports.ForecastSchema = zod_1.z.object({
    forecastName: zod_1.z.string().min(1),
    droneId: zod_1.z.string().min(1),
    latitude: zod_1.z.coerce.number().min(-90).max(90),
    longitude: zod_1.z.coerce.number().min(-180).max(180),
    windSpeed: zod_1.z.coerce.number().min(0).max(150),
    windDirection: zod_1.z.coerce.number().min(0).max(359.99),
});
exports.ForecastConfirmSchema = exports.ForecastSchema.extend({
    snapshot: zod_1.z.string().min(1, "ต้องมีไฟล์ภาพ snapshot ส่งมาด้วย"),
});
//# sourceMappingURL=forecast.schema.js.map