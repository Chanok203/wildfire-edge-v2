import { Router } from 'express';

import * as apiController from '@/modules/drones/drones.api-controller';
import * as controller from '@/modules/drones/drones.controller';

const router = Router();

router.get("/", controller.renderDroneList);
router.get("/:droneId/player", controller.renderDronePlayer);

const apiRouter = Router();

apiRouter.post("/", apiController.getDroneList);

export { router as droneRouter, apiRouter as droneApiRouter };
