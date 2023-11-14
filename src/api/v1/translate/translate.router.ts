import { Router } from 'express';

import TranslateController from './translate.controller';

export const path = '/translate';
export const router = Router();

router.post('/', new TranslateController().translate);
