import { Router } from 'express';

import { droneApiRouter, droneRouter } from '@/modules/drones/drones.route';
import { homeRouter } from '@/modules/home/home.route';
import {
    hotspotManagerApiRouter,
    hotspotManagerRouter,
} from '@/modules/hotspot-manager/hotspot-manager.route';
import { windApiRouter, windRouter } from '@/modules/wind/wind.route';

const router = Router();

router.use('/', homeRouter);
router.use('/wind', windRouter);
router.use('/drones', droneRouter);
router.use('/hotspot-manager', hotspotManagerRouter);

const apiRouter = Router();

apiRouter.use('/wind', windApiRouter);
apiRouter.use('/drones', droneApiRouter);
apiRouter.use('/hotspot-manager', hotspotManagerApiRouter);

export { router, apiRouter };
