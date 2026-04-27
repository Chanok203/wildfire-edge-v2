import { Request, Response } from 'express';

import { HotspotManagerService } from '@/modules/hotspot-manager/hotspot-manager.service';

const hotspotManagerService = new HotspotManagerService();

export const getInstanceList = async (req: Request, res: Response) => {
    const items = await hotspotManagerService.getList();
    res.json({ data: items });
};
