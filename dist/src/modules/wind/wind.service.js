"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindService = void 0;
const prisma_lib_1 = require("../../shared/libs/prisma.lib");
const socketio_lib_1 = require("../../shared/libs/socketio.lib");
class WindService {
    async handleIncomingData(payload, doSave) {
        try {
            const data = {
                id: payload.id,
                speed: payload.speed,
                direction: payload.direction,
                timestamp: new Date(),
                sensorTs: payload.ts,
            };
            if (doSave) {
                // save to DB
                const windData = await prisma_lib_1.prisma.windData.create({
                    data: {
                        sensorId: data.id,
                        speed: data.speed,
                        direction: data.direction,
                        sensorTs: data.sensorTs,
                        createdAt: data.timestamp,
                    },
                });
            }
            // push to client
            socketio_lib_1.socketLib.emit('wind:data:update', data);
        }
        catch (error) {
            console.error('[WIND SENSOR] Insert Error', error);
        }
    }
    async findAllForDataTable(page, limit, sortField, sortDir, search) {
        const skip = (page - 1) * limit;
        const where = search
            ? { sensorId: { contains: search, mode: 'insensitive' } }
            : {};
        const [items, total, filterd] = await prisma_lib_1.prisma.$transaction([
            prisma_lib_1.prisma.windData.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortField]: sortDir },
            }),
            prisma_lib_1.prisma.windData.count(),
            prisma_lib_1.prisma.windData.count({ where }),
        ]);
        return { items, total, filterd };
    }
    async filterByDate(beginDate, endDate) {
        const data = await prisma_lib_1.prisma.windData.findMany({
            where: {
                createdAt: {
                    gte: new Date(beginDate),
                    lte: new Date(endDate),
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        return data;
    }
    async deleteByDate(beginDate, endDate) {
        const result = await prisma_lib_1.prisma.windData.deleteMany({
            where: {
                createdAt: { gte: new Date(beginDate), lte: new Date(endDate) },
            },
        });
        return result.count;
    }
}
exports.WindService = WindService;
//# sourceMappingURL=wind.service.js.map