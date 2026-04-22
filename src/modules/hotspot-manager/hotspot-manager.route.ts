import { Router } from 'express';

import * as apiController from '@modules/hotspot-manager/hotspot-manager.api-controller';
import * as controller from '@modules/hotspot-manager/hotspot-manager.controller';

const router = Router();

router.get('/', controller.renderInstanceList);
router.post('/create', controller.handleCreateInstance);
router.post('/delete-all', controller.handleDeleteAllInstances);
router.post('/:droneId/delete', controller.handleDeleteInstance);
router.get('/:droneId/player', controller.renderInstancePlayer);

const apiRouter = Router();

apiRouter.post('/', apiController.getInstanceList);

export { router as hotspotManagerRouter, apiRouter as hotspotManagerApiRouter };
