import { Router } from 'express';

import ItemController from './item.controller';

export const path = '/items';
export const router = Router();

router.put('/', new ItemController().refreshItems);
