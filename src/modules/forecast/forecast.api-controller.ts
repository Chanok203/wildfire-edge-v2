import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

import { v4 as uuid4 } from 'uuid';

import { ForecastService } from '@/modules/forecast/forecast.service';
import { aiQueue } from '@/queues/queue';
import { writeBase64ToFile } from '@/shared/utils/base64-to-image.util';

const forecastService = new ForecastService();

export const createForcast = async (req: Request, res: Response) => {
    const { originalImage, detectedImage, ...inputData } = req.body;
    try {
        const forecastId = `forecast_${uuid4()}`;
        const { dir, inputDir, outputDir } =
            await forecastService.prepareFolder(forecastId);

        writeBase64ToFile(originalImage, path.join(inputDir, 'original.jpg'));
        writeBase64ToFile(detectedImage, path.join(inputDir, 'detected.jpg'));
        await fs.writeFile(
            path.join(inputDir, 'detection-response.json'),
            JSON.stringify(inputData, null, 2),
            'utf-8',
        );
        const forecast = await forecastService.create(forecastId, inputData);
        aiQueue.add(`aiQueue`, {
            id: forecast.id,
            dir: dir,
        });
        res.json({
            status: 'success',
            data: {
                forecast: { id: forecast.id },
            },
        });
    } catch (error) {
        console.error(error);
        res.json({ status: 'error', message: 'ไม่สามารถสร้างการทำนายได้' });
    }
};

export const getForcast = async (req: Request, res: Response) => {
    const forecastId = req.params.forecastId as string;
    try {
        const forecast = await forecastService.getById(forecastId);
        if (!forecast) {
            return res.status(404).json({
                status: 'fail',
                data: 'Not Found',
            });
        }
        res.json({
            status: 'success',
            data: { forecast },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
};

export const getForecastList = async (req: Request, res: Response) => {
    const { draw, start, length, search, order, columns } = req.body;

    const sortColumnIndex = order?.[0]?.column;
    const sortDir = order?.[0]?.dir;

    const sortField = columns?.[sortColumnIndex]?.data || 'createdAt';

    const limit = Number(length) || 10;
    const page = Number(start) / limit + 1;

    const { items, total, filterd } = await forecastService.findAllForDataTable(
        page,
        limit,
        sortField,
        sortDir,
        search.value,
    );
    res.json({
        draw: Number(draw),
        recordsTotal: total,
        recordsFiltered: filterd,
        data: items,
    });
};
