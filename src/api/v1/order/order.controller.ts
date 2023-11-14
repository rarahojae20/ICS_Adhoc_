/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import logger from '../../../lib/logger';

import { Result } from '../../../common/result';

import OrderService from './order.service';

export default class OrderController {
    /**
     * 셀러가 마켓플레이스의 주문 정보를 갱신하는 API
     *
     * 현재 셀러의 키를 받지않고있음.
     * 추후에 키를 따로 받아오도록 해야함.
     *
     * @param req
     * @param res
     */
    refreshOrders = async (req: Request, res: Response) => {
        const { marketPlace, dataSource, targetHost } = req.body;
        let response;

        try {
            const order = await new OrderService().refreshOrders(marketPlace, dataSource, targetHost);
            response = Result.ok<number>(order).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    }
}
