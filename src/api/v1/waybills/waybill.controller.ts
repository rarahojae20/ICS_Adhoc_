/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import logger from '../../../lib/logger';
import { Result } from '../../../common/result';

import { WaybillDto } from "../../../common/dto/waybill.dto";
import { IWaybill } from "../../../types/core/waybill";
import WaybillService from "../waybills/waybill.service";

export default class WaybillController {

    public create = async (req: Request, res: Response) => {
        const waybillData: IWaybill = req.body;
        let result;

        try {
            const newWaybillNo = await new WaybillService().create(waybillData);

            result = Result.ok<WaybillDto>(new WaybillDto(newWaybillNo)).toJson();
            logger.log(`result : ${JSON.stringify(result)}`);

        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            result = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, result, req);
        res.status(httpStatus.OK).json(result);
    }// create
}
