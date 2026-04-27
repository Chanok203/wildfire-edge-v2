import fs from 'fs/promises';
import path from 'path';

import { Prisma } from '@generated/prisma/client';
import { AIStatus } from '@generated/prisma/enums';

import { config } from '@/configs';
import { prisma } from '@/shared/libs/prisma.lib';
import { NotFoundError } from '@/shared/utils/error.utils';

export class ForecastService {
    async prepareFolder(id: string) {
        const dir = path.join(config.app.forecastDir, id);
        const inputDir = path.join(dir, 'input');
        const outputDir = path.join(dir, 'output');
        try {
            await fs.mkdir(inputDir, { recursive: true });
            await fs.mkdir(outputDir, { recursive: true });
            return { dir, inputDir, outputDir };
        } catch (error) {
            throw new Error(`ไม่สามารถเตรียมโฟลเดอร์ได้`);
        }
    }

    async create(id: string, inputData: any) {
        try {
            const forecast = await prisma.forecast.create({
                data: {
                    id: id,
                    name: inputData.forecastName as string,
                    droneName: inputData.droneId as string,
                    latitude: Number(inputData.latitude),
                    longitude: Number(inputData.longitude),
                    inputData: inputData,
                    aiStatus: AIStatus.IN_QUEUE,
                },
            });
            return forecast;
        } catch (error) {
            console.error(error);
            throw new Error(`[Forecast Create] Error`);
        }
    }

    async getById(id: string) {
        try {
            return await prisma.forecast.findFirst({
                where: { id },
            });
        } catch (error) {
            throw new NotFoundError(`[Forecast getById] ${id}`);
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
        const where: Prisma.ForecastWhereInput = search
            ? {
                  OR: [
                      { name: { contains: search, mode: 'insensitive' } },
                      { droneName: { contains: search, mode: 'insensitive' } },
                  ],
              }
            : {};

        const [items, total, filterd] = await prisma.$transaction([
            prisma.forecast.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortField]: sortDir,
                },
            }),
            prisma.forecast.count(),
            prisma.forecast.count({ where }),
        ]);
        return { items, total, filterd };
    }

    async deleteById(id: string) {
        try {
            const forecast = await prisma.forecast.delete({
                where: { id: id },
            });

            const dir = path.join(config.app.forecastDir, forecast.id);
            await fs.rm(dir, { recursive: true, force: true });
            return forecast;
        } catch (error) {
            console.error(`[FORECAST DELETE]`);
            throw error;
        }
    }
}
