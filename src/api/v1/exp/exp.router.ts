import { Router } from 'express';

import ExportController from './exp.controller';

export const path = '/exports';
export const router = Router();

router.get('/', new ExportController().checkExports);
router.post('/', new ExportController().registerExports);
router.get('/simplify', new ExportController().checkSimplifiedExports);
router.post('/simplify', new ExportController().registerSimplifiedExports);
