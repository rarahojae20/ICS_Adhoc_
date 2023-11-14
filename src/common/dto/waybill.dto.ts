import { Builder } from 'builder-pattern';
import { BaseDto } from '../base/base.dto';

import { prune } from '../../lib/utils';

import { IWaybill } from "../../types/core/waybill";

export class WaybillDto extends BaseDto<IWaybill> {
    public waybill: IWaybill;

    constructor(waybill: IWaybill) {
        super();

        const waybillBuild = Builder<IWaybill>()
            ._id(waybill?._id)
            .waybill_no(waybill?.waybill_no)
            .courier(waybill?.courier)
            .created_at(waybill?.created_at)
            .updated_at(waybill?.updated_at)
            .deleted_at(waybill?.deleted_at)
            .build();

        this.waybill = prune(waybillBuild);
    }
}
