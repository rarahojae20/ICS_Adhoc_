import { Router } from 'express';
import CommentController from './comment.controller';
import MiddleWare from '../../../lib/middleware';

export const path = '/comments';
export const router = Router();

router.get('/', new CommentController().list);
router.post('/', new MiddleWare().uploadS3Image.array('images'), new CommentController().create);


/*
comment_id 
board_id 추가해서 외래키처럼사용

*/