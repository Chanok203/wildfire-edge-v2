import { Prisma } from '@generated/prisma/client';

import { prisma } from '@/shared/libs/prisma.lib';
import { socketLib } from '@/shared/libs/socketio.lib';

export class WindService {
    async handleIncomingData(payload: any, doSave: boolean) {
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
                const windData = await prisma.windData.create({
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
            socketLib.emit('wind:data:update', data);
        } catch (error) {
            console.error('[WIND SENSOR] Insert Error', error);
        }
    }

    async findAllForDataTable(
        page: number,
        limit: number,
        sortField: string,
        sortDir: string,
        search?: string,
    ) {
        const skip = (page - 1) * limit;
        const where: Prisma.WindDataWhereInput = search
            ? { sensorId: { contains: search, mode: 'insensitive' } }
            : {};

        const [items, total, filterd] = await prisma.$transaction([
            prisma.windData.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortField]: sortDir },
            }),
            prisma.windData.count(),
            prisma.windData.count({ where }),
        ]);
        return { items, total, filterd };
    }

    async filterByDate(beginDate: Date | string, endDate: Date | string) {
        const data = await prisma.windData.findMany({
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

    async deleteByDate(beginDate: Date | string, endDate: Date | string) {
        const result = await prisma.windData.deleteMany({
            where: {
                createdAt: { gte: new Date(beginDate), lte: new Date(endDate) },
            },
        });
        return result.count;
    }
}
