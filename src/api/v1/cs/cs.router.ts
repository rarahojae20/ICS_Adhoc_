import { Router } from 'express';
import CsController from './cs.controller';
import MiddleWare from '../../../lib/middleware';

export const path = '/cs';
export const router = Router();

router.get('/', new CsController().list);
router.post('/', new MiddleWare().uploadS3Image.array('images'), new CsController().create);

router.get('/download-excel', new CsController().downloadExcel);

router.get('/:csId', new CsController().get); 
router.put('/:csId', new MiddleWare().uploadS3Image.array('images'), new CsController().update);
router.delete('/:csId', new CsController().delete);

