import { Request, Response } from 'express';
import { readdirSync, statSync } from 'fs';
import path from 'path';

import { config } from '@/configs';
import { WindService } from '@/modules/wind/wind.service';
import { redis } from '@/shared/libs/redis.lib';
import { socketLib } from '@/shared/libs/socketio.lib';
import { BadRequestError } from '@/shared/utils/error.utils';

const windService = new WindService();

export const getWindDataList = async (req: Request, res: Response) => {
    const { draw, start, length, search, order, columns } = req.body;

    const sortColumnIndex = order?.[0]?.column;
    const sortDir = order?.[0]?.dir;

    const sortField = columns?.[sortColumnIndex]?.data || 'createdAt';

    const limit = Number(length) || 10;
    const page = Number(start) / limit + 1;

    const { items, total, filterd } = await windService.findAllForDataTable(
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

export const getCSVList = async (req: Request, res: Response) => {
    const { draw, start, length, search, order, columns } = req.body;

    const dir = config.app.csvDir;

    const files = readdirSync(dir)
        .filter((file) =>
            file.endsWith('.csv') && search ? true : file.includes(search),
        )
        .map((file) => {
            const stats = statSync(path.join(dir, file));
            return {
                name: file,
                size: (stats.size / 1024).toFixed(2) + ' KB',
                createdAt: stats.birthtime,
            };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    res.json({
        draw: Number(draw),
        recordsTotal: files.length,
        recordsFiltered: files.length,
        data: files,
    });
};

export const getSensorStatus = async (req: Request, res: Response) => {
    const status = await redis.get(`wildfire:sensor:status`);
    res.json({
        status: 'success',
        data: {
            status,
        },
    });
};

export const setRecording = async (req: Request, res: Response) => {
    const { isRecording } = req.body;
    if (typeof isRecording !== 'boolean') {
        throw new BadRequestError(`"isRecording" ต้องเป็น boolean`);
    }

    await redis.set('wildfire:recording:status', String(isRecording));
    socketLib.emit('wind:recording:update', isRecording);
    res.json({
        status: 'success',
        data: {
            isRecording,
            message: isRecording ? "เริ่มการบันทึกข้อมูล" : "หยุดการบันทึกข้อมูล"
        },
    });
};
