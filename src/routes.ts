import { homeRouter } from '@/modules/home/home.route';
import { windApiRouter, windRouter } from '@/modules/wind/wind.route';
import { Router } from 'express';

const router = Router();

router.use('/', homeRouter);
router.use('/wind', windRouter);

const apiRouter = Router();

apiRouter.use('/wind', windApiRouter);

export { router, apiRouter };
