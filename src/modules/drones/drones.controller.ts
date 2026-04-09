import { Request, Response } from 'express';

import { config } from '@/configs';

const entity = 'drones';

export const renderDroneList = (req: Request, res: Response) => {
    res.render('drones/drones-list.html', { entity });
};

export const renderDronePlayer = (req: Request, res: Response) => {
    const { droneId } = req.params;

    res.render('drones/drones-player.html', {
        entity,
        droneId,
        src: `http://${config.app.publicIp}:8889/${droneId}`,
    });
};
