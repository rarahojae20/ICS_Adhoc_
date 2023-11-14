/* eslint-disable @typescript-eslint/no-explicit-any */
import { Waybill } from "../../../models/waybill.model";
import { IWaybill } from "../../../types/core/waybill";

export default class WaybillRepository {

    public findOne = async (attr: IWaybill): Promise<Waybill> => {
        return await Waybill.findOne({
            where: { ...attr },
        });
    };

    public create = async (param: IWaybill, option): Promise<Waybill> => {
        const { transaction } = option;

        return await Waybill.create(param, { transaction });
    };

    public delete = async (param: IWaybill): Promise<Waybill> => {

        const waybillNo = await this.findOne({ waybill_no: param.waybill_no });
        if (waybillNo.courier === 'testCarrier') {
            await Waybill.destroy({
                where: { _id: waybillNo._id }
            });
        } else {
            await waybillNo.set('deleted_at', new Date()).save();
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any

        return waybillNo;
    };
}
