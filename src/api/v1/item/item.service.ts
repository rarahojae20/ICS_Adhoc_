/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdhocItem } from '../../../types/item';

import ItemRepository from './item.repository';

import Marketplace from '../../../marketplace';

export default class ItemService {
    private marketplace: Marketplace;

    public refreshItems = async(marketplace: string, dataSource?: string, targetHost?: string) => {
        this.marketplace = await Marketplace.setMarketplace(marketplace);
        return await this.marketplace.updateItem(dataSource, targetHost);
    };

	public upsertItem = async(params: AdhocItem): Promise<AdhocItem> => {
		const item = await new ItemRepository().get({
            item_no: params.item_no
        });
        let result: AdhocItem;

        if (item) {
            result = await new ItemRepository().update(params);
        } else {
            result = await new ItemRepository().create(params);
        }

        return result;
	};

    public list = async(where: any): Promise<{ rows: AdhocItem[]; count: number; }> => {
        return await new ItemRepository().list(where);
    };
}
