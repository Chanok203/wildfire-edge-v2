import { Router } from 'express';

import * as apiController from '@modules/forecast/forecast.api-controller';
import * as controller from '@modules/forecast/forecast.controller';

const router = Router();

router.get('/', controller.renderForecastList);
router.get('/create', controller.renderForecastCreate);
router.post('/confirm', controller.handleForecastCreate);
router.post('/:forecastId/delete', controller.handleForecastDelete);
router.get('/view', controller.renderView);
router.post('/:forecastId/push', controller.handlePush);

const apiRouter = Router();

apiRouter.post('/', apiController.getForecastList);
apiRouter.post('/create', apiController.createForcast);
apiRouter.get('/:forecastId', apiController.getForcast);

export { router as forecastRouter, apiRouter as forecastApiRouter };
