import { Request, Response } from 'express';

import { v4 as uuidv4 } from 'uuid';

import { config } from '@/configs';
import { DroneService } from '@/modules/drones/drone.service';
import {
    ForecastInput,
    ForecastSchema,
} from '@/modules/forecast/forecast.schema';
import { HotspotManagerService } from '@/modules/hotspot-manager/hotspot-manager.service';

const entity = 'forecast';

const droneService = new DroneService();
const hotspotManagerService = new HotspotManagerService();

export const renderForecastList = async (req: Request, res: Response) => {
    const droneList = await droneService.getDroneList();
    res.render('forecast/forecast-list.html', { entity, droneList });
};

export const renderForecastCreate = async (req: Request, res: Response) => {
    const forecastName = req.query.name as string;
    const droneId = req.query.droneId as string;
    const forecastId = `forecast_${uuidv4()}`;
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
        forecastId,
        src,
    });
};

export const handleForecastCreate = async (req: Request, res: Response) => {
    try {
        const input: ForecastInput = ForecastSchema.parse(req.body);

        const snapshot = await hotspotManagerService.getSnapShot(input.droneId);
        if (!snapshot) {
            throw new Error(`ไม่สามารถสร้าง snapshot ได้`);
        }

        res.render('forecast/forecast-confirm.html', { snapshot, ...input });
    } catch (error) {
        console.error(error);
        req.flash('danger', 'ไม่สามารถเตรียมข้อมูลได้');
        res.redirect('/forecast');
    }
};

