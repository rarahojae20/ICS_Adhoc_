import { Router } from 'express';

import OrderController from './order.controller';

export const path = '/orders';
export const router = Router();

router.put('/', new OrderController().refreshOrders);
