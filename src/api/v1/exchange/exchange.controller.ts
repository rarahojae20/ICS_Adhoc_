/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { Result } from '../../../common/result';
import { ExchangeDto } from '../../../common/dto/exchange.dto';

import logger from '../../../lib/logger';

import ExchangeService from './exchange.service';

export default class ExchangeController {
    /**
     * 셀러가 마켓플레이스의 상품 정보를 갱신하는 API
     *
     * 현재 셀러의 키를 받지않고있음.
     * 추후에 키를 따로 받아오도록 해야함.
     *
     * @param req
     * @param res
     */
    public getExchanges = async (req: Request, res: Response) => {
        let response;

        try {
            const result: ExchangeDto = await new ExchangeService().getExchanges();
            logger.debug('getExchanges result:', result);
            response = Result.ok<ExchangeDto>(result).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };
}
