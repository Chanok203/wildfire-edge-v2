import { Router } from "express";

import * as controller from '@modules/forecast/forecast.controller';
import * as apiController from '@modules/forecast/forecast.api-controller';

const router = Router();

router.get("/", controller.renderForecastList);
router.get("/create", controller.renderForecastCreate);
router.post("/create", controller.handleForecastCreate);

const apiRouter = Router();

apiRouter.post("/create", apiController.createForcast);

export {
    router as forecastRouter,
    apiRouter as forecastApiRouter
}