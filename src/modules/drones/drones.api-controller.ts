import { DroneService } from '@/modules/drones/drone.service';
import { Request, Response } from 'express';

const droneService = new DroneService();

export const getDroneList = async (req: Request, res: Response) => {
    const { draw } = req.body;
    const items = await droneService.getDroneList();
    res.json({
        draw: Number(draw) || 0,
        recordsTotal: items.length,
        recordsFiltered: items.length,
        data: items,
    });
};
