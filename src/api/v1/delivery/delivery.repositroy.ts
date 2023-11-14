import { Order } from '../../../../src/models/order.model'
import { IDelivery } from "../../../../src/types/delivery";
import logger from '../../../../src/lib/logger';
import { mysql } from '../../../../src/lib/mysql';

export default class DeliveryRepository {

public create = async(param: IDelivery): Promise<Order> => {
    const transaction = await mysql.transaction();
    let order: Order;

    try {
        order = await Order.create(param, { transaction });
        await transaction.commit();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        logger.error(e);
        await transaction.rollback();
        order = null;
    }

    return order;
};
}