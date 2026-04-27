import { DroneService } from '@/modules/drones/drone.service';
import { Request, Response } from 'express';

const droneService = new DroneService();

export const getDroneList = async (req: Request, res: Response) => {
    const items = await droneService.getDroneList();
    res.json({data: items});
};
