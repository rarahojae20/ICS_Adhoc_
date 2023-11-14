/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiError from '../../../lib/api.error';
import ApiCodes from '../../../lib/api.codes';
import ApiMessages from '../../../lib/api.messages';
import ApiDetailCodes from '../../../lib/api.detail.codes';
import { assertNotNull } from '../../../lib/utils';

import { AdhocOrder } from '../../../types/order';

import { Orders } from '../../../models/orders.model';

export default class OrderRepository {
    public list = async(where: any): Promise<{ rows: Orders[]; count: number }> => {
        return Orders.findAndCountAll({
            where
        });
    };

    public get = async(where: any): Promise<Orders> => {
        return Orders.findOne({
            where
        });
    };

    public create = async(param: AdhocOrder): Promise<Orders> => {
		return await Orders.create(param);
	};

    public update = async(param: AdhocOrder): Promise<Orders> => {
        const order = await this.get({
            order_no: param.order_no
        });
        assertNotNull(order, new ApiError(ApiCodes.NOT_FOUND, ApiMessages.NOT_FOUND, {
            message: 'order variable does not exists',
            code: ApiDetailCodes.ORDER_VALUE_NULL,
        }));

        order.seller_name = param.seller_name;
        order.payload = param.payload;
        order.updated_at = new Date();

        await order.save();

        return order;
	};
}
