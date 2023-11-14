import logger from "../../../lib/logger";
import { mysql } from "../../../lib/mysql";
import { Consignee } from "../../../models/consignees.model";

import { IConsignee } from "../../../types/consignee";

export default class ConsigneeRepository {

public create = async(param: IConsignee): Promise<Consignee> => {
    const transaction = await mysql.transaction();
    let shipper: Consignee;

    try {
        shipper = await Consignee.create(param, { transaction });
        await transaction.commit();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        logger.error(e);
        await transaction.rollback();
        shipper = null;
    }

    return shipper;
};
}