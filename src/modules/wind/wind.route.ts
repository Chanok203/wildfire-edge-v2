import { Router } from 'express';

import * as apiController from '@/modules/wind/wind.api-controller';
import * as controller from '@/modules/wind/wind.controller';

const router = Router();

router.get('/', controller.renderListWindData);
router.post('/export', controller.exportToCSV);
router.post('/export-and-delete', controller.exportAndDelete);
router.get('/csv-history', controller.renderCSVHistory);
router.post('/csv-history/download/:filename', controller.downloadCSV);
router.post('/csv-history/delete/:filename', controller.deleteCSV);

const apiRouter = Router();

apiRouter.post('/', apiController.getWindDataList);
apiRouter.post('/history', apiController.getCSVList);
apiRouter.get('/status', apiController.getSensorStatus);
apiRouter.post('/recording', apiController.setRecording);

export { router as windRouter, apiRouter as windApiRouter };
