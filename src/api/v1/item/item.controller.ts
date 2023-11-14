/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import logger from '../../../lib/logger';

import { Result } from '../../../common/result';

import ItemService from './item.service';

export default class ItemController {
    /**
     * 셀러가 마켓플레이스의 상품 정보를 갱신하는 API
     *
     * 현재 셀러의 키를 받지않고있음.
     * 추후에 키를 따로 받아오도록 해야함.
     *
     * @param req
     * @param res
     */
    public refreshItems = async (req: Request, res: Response) => {
        const { marketPlace, dataSource, targetHost } = req.body;
        let response;

        try {
            const item = await new ItemService().refreshItems(marketPlace, dataSource, targetHost);
            response = Result.ok<number>(item).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };
}
