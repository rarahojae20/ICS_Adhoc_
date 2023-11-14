import { Router } from 'express';

import ExchangeController from './exchange.controller';

export const path = '/exchange';
export const router = Router();

router.get('/', new ExchangeController().getExchanges);
