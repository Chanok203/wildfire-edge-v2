import { Prisma } from '@generated/prisma/client';

import { prisma } from '@/shared/libs/prisma.lib';
import { socketLib } from '@/shared/libs/socketio.lib';

export class WindSensorService {
    async handleIncomingData(payload: any) {
        try {
            // save to DB
            const windData = await prisma.windData.create({
                data: {
                    sensorId: payload.id,
                    speed: payload.speed,
                    direction: payload.direction,
                    sensorTs: payload.ts,
                },
            });
            // push to client
            socketLib.emit('wind:update', {
                id: windData.sensorId,
                speed: windData.speed,
                direction: windData.direction,
                timestamp: windData.createdAt,
            });
        } catch (error) {
            console.error('[WIND SENSOR] Insert Error', error);
        }
    }

    async findAll(page: number = 1, limit: number = 10, search?: string) {
        const skip = (page - 1) * limit;
        const where: Prisma.WindDataWhereInput = search
            ? {
                  sensorId: { contains: search, mode: 'insensitive' },
              }
            : {};
        console.log(where)
        const [data, total] = await prisma.$transaction([
            prisma.windData.findMany({
                where: where,
                skip: skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.windData.count({ where }),
        ]);
        return {
            items: data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
