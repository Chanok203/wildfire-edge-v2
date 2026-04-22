import { HotspotManagerService } from '@/modules/hotspot-manager/hotspot-manager.service';
import { Request, Response } from 'express';

const hotspotManagerService = new HotspotManagerService();

export const getInstanceList = async (req: Request, res: Response) => {
    const { draw } = req.body;
    
    const items = await hotspotManagerService.getList();
    res.json({
        draw: Number(draw) || 0,
        recordsTotal: items.length,
        recordsFiltered: items.length,
        data: items,
    });
};
