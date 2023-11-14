/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdhocItem } from '../../../types/item';

import ApiError from '../../../lib/api.error';
import ApiCodes from '../../../lib/api.codes';
import ApiMessages from '../../../lib/api.messages';
import ApiDetailCodes from '../../../lib/api.detail.codes';
import { assertNotNull } from '../../../lib/utils';

import { Items } from '../../../models/items.model';

export default class ItemRepository {
	public list = async(where: any): Promise<{ rows: Items[]; count: number }> => {
        return Items.findAndCountAll({
            where
        });
    };

    public get = async(where: any): Promise<Items> => {
        return Items.findOne({
            where
        });
    };

    public create = async(param: AdhocItem): Promise<Items> => {
		return await Items.create(param);
	};

    public update = async(param: AdhocItem): Promise<Items> => {
        const item = await this.get({
            item_no: param.item_no
        });
        assertNotNull(item, new ApiError(ApiCodes.NOT_FOUND, ApiMessages.NOT_FOUND, {
            message: 'item variable does not exists',
            code: ApiDetailCodes.ITEM_VALUE_NULL,
        }));

        item.seller_name = param.seller_name;
        item.payload = param.payload;
        item.updated_at = new Date();

        await item.save();

		return item;
	};
}
