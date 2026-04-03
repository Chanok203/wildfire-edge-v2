import { Router } from 'express';

import { homeView } from '@/modules/home/home.controller';

const router = Router();

router.get('/', homeView);

export { router as homeRouter };
