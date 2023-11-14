import { Shipper } from "../../../models/shipper.model";
import { IShipper } from "../../../types/shipper";


import { mysql } from '../../../lib/mysql';
import logger from '../../../lib/logger';


export default class ShipperRepository {

    public create = async(param: IShipper): Promise<Shipper> => {
    const transaction = await mysql.transaction();
    let shipper: Shipper;

    try {
        shipper = await Shipper.create(param, { transaction });
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