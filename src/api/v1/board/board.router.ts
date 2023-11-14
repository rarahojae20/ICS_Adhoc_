import { Router } from 'express';
import BoardController from './board.controller';
import MiddleWare from '../../../lib/middleware';

export const path = '/boards';
export const router = Router();

router.get('/', new BoardController().list);
router.post('/', new MiddleWare().uploadS3Image.array('images'), new BoardController().create);

router.get('/download-excel', new BoardController().downloadExcel)

router.get('/:boardId', new BoardController().get); //_Id
router.put('/:boardId', new MiddleWare().uploadS3Image.array('images'), new BoardController().update);
router.delete('/:boardId', new BoardController().delete);

