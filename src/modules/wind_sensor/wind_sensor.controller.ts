import { Request, Response } from 'express';

import { WindSensorService } from '@/modules/wind_sensor/wind_sensor.service';

const windSensorService = new WindSensorService();

export const listView = async (req: Request, res: Response) => {
    
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const search = req.query.search ? `${req.query.search}` : undefined
        const data = await windSensorService.findAll(page, limit, search);
        res.render('wind_sensor/wind_sensor_list.html', { data, search });
    } catch (error) {
        throw new Error(`${error}`);   
    }
};
