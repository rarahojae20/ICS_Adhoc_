import logger from "../../../lib/logger";
import { mysql } from "../../../lib/mysql";
import { OrderInvoice } from "../../../models/order_invoices.model";
import { IOrderInvoice } from "../../../types/Invoice";

export default class OrderInvoiceRepository {

public create = async(param: IOrderInvoice): Promise<OrderInvoice> => {
    const transaction = await mysql.transaction();
    let orderInvoice: OrderInvoice;

    try {
        orderInvoice = await OrderInvoice.create(param, { transaction });
        await transaction.commit();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        logger.error(e);
        await transaction.rollback();
        orderInvoice = null;
    }

    return orderInvoice;
};
}