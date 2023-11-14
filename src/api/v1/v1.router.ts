import { Router } from 'express';

// import * as translate from './translate/translate.router';
import * as item from './item/item.router';
import * as order from './order/order.router';
import * as exchange from './exchange/exchange.router';
import * as board from './board/board.router';
import * as comment from './comment/comment.router';
import * as email from './email/email.router';
import * as tempalte from './templates/template.router';
import * as waybill from './waybills/waybill.router';
import * as hscode from './hscode/hscode.router';
import * as addr from './addr/addr.router';
import * as exp from './exp/exp.router';
import * as flight from './flight/flight.router';
import * as cs from './cs/cs.router';
import * as delivery from './delivery/delivery.router'

export const router = Router();
export const path = '/v1';

// router.use(translate.path, translate.router);
router.use(item.path, item.router);
router.use(order.path, order.router);
router.use(exchange.path, exchange.router);
router.use(board.path, board.router);
router.use(comment.path, comment.router);
router.use(email.path, email.router);
router.use(tempalte.path, tempalte.router);
router.use(waybill.path, waybill.router);
router.use(hscode.path, hscode.router);
router.use(addr.path, addr.router);
router.use(exp.path, exp.router);
router.use(flight.path, flight.router);
router.use(cs.path, cs.router);
router.use(delivery.path, delivery.router);

