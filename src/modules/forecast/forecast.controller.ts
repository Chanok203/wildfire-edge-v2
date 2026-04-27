import { Request, Response } from 'express';

import { v4 as uuidv4 } from 'uuid';

import { config } from '@/configs';
import { DroneService } from '@/modules/drones/drone.service';
import {
    ForecastInput,
    ForecastSchema,
} from '@/modules/forecast/forecast.schema';
import { ForecastService } from '@/modules/forecast/forecast.service';
import { HotspotManagerService } from '@/modules/hotspot-manager/hotspot-manager.service';

const entity = 'forecast';

const droneService = new DroneService();
const hotspotManagerService = new HotspotManagerService();
const forecastService = new ForecastService();

export const renderForecastList = async (req: Request, res: Response) => {
    const droneList = await droneService.getDroneList();
    res.render('forecast/forecast-list.html', { entity, droneList });
};

export const renderForecastCreate = async (req: Request, res: Response) => {
    const forecastName = req.query.name as string;
    const droneId = req.query.droneId as string;
    const src = `http://${config.app.publicIp}:8889/AI/${droneId}`;

    const instance = await hotspotManagerService.getById(droneId);

    if (instance) {
        await hotspotManagerService.extendTimeById(droneId);
    } else {
        const input_url = `${config.mediamtx.rtsp}/${droneId}`;
        const output_url = `${config.mediamtx.rtsp}/AI/${droneId}`;
        const created = await hotspotManagerService.create(
            droneId,
            input_url,
            output_url,
        );
        if (!created) {
            req.flash('danger', 'ไม่สามารถเริ่มการทำงานได้ โปรดตรวจสอบโดรน');
            return res.redirect('/forecast');
        }
    }

    res.render('forecast/forecast-create.html', {
        entity,
        forecastName,
        droneId,
        src,
    });
};

export const handleForecastCreate = async (req: Request, res: Response) => {
    try {
        const input: ForecastInput = ForecastSchema.parse(req.body);
        const data = await hotspotManagerService.getAnalysis(input.droneId);
        if (!data) {
            throw new Error(`ไม่สามารถเตรียมได้`);
        }
        data.bboxes = JSON.stringify(data.bboxes, null, 2);
        res.render('forecast/forecast-confirm.html', {
            entity,
            data,
            ...input,
        });
    } catch (error) {
        console.error(error);
        req.flash('danger', 'ไม่สามารถเตรียมข้อมูลได้');
        res.redirect('/forecast');
    }
};

export const handleForecastDelete = async (req: Request, res: Response) => {
    const { forecastId } = req.params;
    const forecast = await forecastService.deleteById(forecastId as string);
    req.flash(
        'success',
        `คุณลบภารกิจ ${forecast.name} (${forecast.id}) สำเร็จแล้ว`,
    );
    res.redirect(`/forecast`);
};
