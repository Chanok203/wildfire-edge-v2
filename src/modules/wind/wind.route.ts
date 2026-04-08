import { Router } from 'express';

import * as apiController from '@/modules/wind/wind.api-controller';
import * as controller from '@/modules/wind/wind.controller';

const router = Router();

router.get('/', controller.renderListWindData);
router.post('/export', controller.exportToCSV);
router.post('/export-and-delete', controller.exportAndDelete);
router.get('/history', controller.renderHistory);
router.post('/history/download/:filename', controller.downloadCSV);
router.post('/history/delete/:filename', controller.deleteCSV);

const apiRouter = Router();

apiRouter.post('/', apiController.getWindDataList);
apiRouter.post('/history', apiController.getCSVList);

export { router as windRouter, apiRouter as windApiRouter };
