import { droneApiRouter, droneRouter } from '@/modules/drones/drones.route';
import { homeRouter } from '@/modules/home/home.route';
import { windApiRouter, windRouter } from '@/modules/wind/wind.route';
import { Router } from 'express';

const router = Router();

router.use('/', homeRouter);
router.use('/wind', windRouter);
router.use('/drones', droneRouter);

const apiRouter = Router();

apiRouter.use('/wind', windApiRouter);
apiRouter.use('/drones', droneApiRouter);

export { router, apiRouter };
