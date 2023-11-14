/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdhocOrder } from '../../../types/order';

import OrderRepository from './order.repository';

import Marketplace from '../../../marketplace';

export default class OrderService {
    private marketplace: Marketplace;

    public refreshOrders = async(marketplace: string, dataSource?: string, targetHost?: string) => {
        this.marketplace = await Marketplace.setMarketplace(marketplace);
        return await this.marketplace.updateOrder(dataSource, targetHost);
    };

	public upsertOrder = async(params: AdhocOrder): Promise<AdhocOrder> => {
		const order = await new OrderRepository().get({
            order_no: params.order_no
        });
        let result: AdhocOrder;

        if (order) {
            result = await new OrderRepository().update(params);
        } else {
            result = await new OrderRepository().create(params);
        }

        return result;
	};

    public list = async(where: any): Promise<{ rows: AdhocOrder[]; count: number; }> => {
        return await new OrderRepository().list(where);
    };
}
