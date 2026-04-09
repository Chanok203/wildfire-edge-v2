import { Request, Response } from 'express';
import {
    existsSync,
    readdirSync,
    statSync,
    unlinkSync,
    writeFileSync,
} from 'fs';
import path from 'path';

import { config } from '@/configs';
import { WindService } from '@/modules/wind/wind.service';
import { redis } from '@/shared/libs/redis.lib';
import { toCSV } from '@/shared/utils/csv.util';
import { NotFoundError } from '@/shared/utils/error.utils';

const entity = 'wind';
const windService = new WindService();

export const renderListWindData = async (req: Request, res: Response) => {
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);
    lastMonth.setHours(0, 0, 0, 0);

    const format = (d: Date) => {
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().slice(0, 16);
    };

    const sensorStatus = await redis.get('wildfire:sensor:status');
    const isRecording =
        (await redis.get('wildfire:recording:status')) === 'true';
    res.render('wind/wind-list.html', {
        entity,
        defaultBegin: format(lastMonth),
        defaultEnd: format(now),
        isRecording: isRecording,
        sensorStatus: sensorStatus,
    });
};

export const exportToCSV = async (req: Request, res: Response) => {
    const { beginDate, endDate } = req.body;

    const startUTC = new Date(beginDate);
    const endUTC = new Date(endDate);

    const data = await windService.filterByDate(startUTC, endUTC);
    const csv = await toCSV(data);

    const format = (d: string) =>
        d.replace(/[:T]/g, '').replace(/-/g, '').slice(0, 13);

    const startName = format(beginDate);
    const endName = format(endDate);
    const filename = `wind_${startName}_to_${endName}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send('\ufeff' + csv);
};

export const exportAndDelete = async (req: Request, res: Response) => {
    const { beginDate, endDate } = req.body;

    const startUTC = new Date(beginDate);
    const endUTC = new Date(endDate);

    const data = await windService.filterByDate(startUTC, endUTC);
    const csv = await toCSV(data);

    const format = (d: string) =>
        d.replace(/[:T]/g, '').replace(/-/g, '').slice(0, 13);

    const startName = format(beginDate);
    const endName = format(endDate);
    const filename = `wind_${startName}_to_${endName}.csv`;

    const dir = config.app.csvDir;
    const filepath = path.join(dir, filename);
    writeFileSync(filepath, '\ufeff' + csv, 'utf-8');

    await windService.deleteByDate(startUTC, endUTC);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send('\ufeff' + csv);
};

export const renderCSVHistory = async (req: Request, res: Response) => {
    res.render('wind/wind-csv-history.html', { entity });
};

export const downloadCSV = async (req: Request, res: Response) => {
    const { filename } = req.params;
    const filepath = path.join(config.app.csvDir, filename as string);
    if (!existsSync(filepath)) {
        throw new NotFoundError(`FILE NOT FOUND: ${filename}`);
    }
    res.download(filepath);
};

export const deleteCSV = async (req: Request, res: Response) => {
    const { filename } = req.params;
    const filepath = path.join(config.app.csvDir, filename as string);
    if (!existsSync(filepath)) {
        throw new NotFoundError(`FILE NOT FOUND: ${filename}`);
    }

    unlinkSync(filepath);
    req.flash('danger', `คุณลบไฟล์ ${filename} สำเร็จแล้ว`);
    res.redirect('/wind/csv-history');
};
