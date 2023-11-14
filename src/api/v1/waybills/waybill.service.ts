/* eslint-disable @typescript-eslint/no-explicit-any */
import WaybillRepository from "../waybills/waybill.repository";
import { Waybill } from "../../../models/waybill.model";
import { IWaybill } from "../../../types/core/waybill";
import ApiError from "../../../lib/api.error";
import ApiCodes from "../../../lib/api.codes";
import ApiMessages from "../../../lib/api.messages";
import ApiDetailCodes from "../../../lib/api.detail.codes";
import { assertNotNull } from "../../../lib/utils";
import AwsSQS from "../../../lib/aws.sqs";
import { mysql } from "../../../lib/mysql";
import logger from "../../../lib/logger";

export default class WaybillService {

    public create = async (waybillData: IWaybill): Promise<Waybill> => {
        const transaction = await mysql.transaction();

        assertNotNull(waybillData?.waybill_no && waybillData?.courier,
            new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
                message: 'waybill_no, courier variable does not exists',
                code: ApiDetailCodes.REQ_PARAM_EMPTY,
            }));
        try {
            const waybillNo = await new WaybillRepository().findOne(waybillData);
            if (waybillNo) {
                throw new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
                    code:    ApiDetailCodes.REQ_PARAM_INVALID,
                    message: 'waybill_no already exist'
                });
            }
            const newWaybillNo = await new WaybillRepository().create(waybillData, { transaction });
            assertNotNull(newWaybillNo,
                new ApiError(ApiCodes.INTERNAL_SERVER_ERROR, ApiMessages.INTERNAL_SERVER_ERROR, {
                    code:    ApiDetailCodes.REQ_PARAM_INVALID,
                    message: 'Failed to generate new waybill_no'
                }));

            await new AwsSQS().sendMessage(newWaybillNo);
            await transaction.commit();
            logger.log(`Add new waybill_no : ${newWaybillNo.courier} -- ${newWaybillNo.waybill_no}`);

            return newWaybillNo;
        } catch (e) {
            logger.error(JSON.stringify(e));
            logger.error(e);
            await transaction.rollback();

            throw e;
        }
    };

    public delete = async (attr: any): Promise<Waybill> => {
        const waybillNo = await new WaybillRepository().findOne({
            waybill_no: attr.waybill_no,
            courier: attr.courier,
        });
        assertNotNull(waybillNo, new ApiError(ApiCodes.NOT_FOUND, ApiMessages.NOT_FOUND, {
            code:    ApiDetailCodes.REQ_PARAM_INVALID,
            message: 'waybill_no does not exist'
        }));

        return await new WaybillRepository().delete(waybillNo);
    };
}
