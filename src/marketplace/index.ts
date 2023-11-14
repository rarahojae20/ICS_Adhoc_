/* eslint-disable @typescript-eslint/no-explicit-any */
import Qoo10Service from './qoo10/qoo10.service';

import ApiError from '../lib/api.error';
import ApiCodes from '../lib/api.codes';
import ApiDetailCodes from '../lib/api.detail.codes';
import ApiMessages from '../lib/api.messages';

export default abstract class Marketplace {
    protected size: number;

    constructor(size = 10) {
        this.size = size;
    }

    static setMarketplace = async(marketplaceParam: string): Promise<Marketplace> => {
        let marketplace: Marketplace;

        switch (marketplaceParam) {
            case 'qoo10':
                marketplace = new Qoo10Service();
                break;
            default:
                throw new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
                    code: ApiDetailCodes.REQ_PARAM_MARKETPLACE_WRONG,
                    message: 'marketplace is invalid value'
                });
        }

        return marketplace
    };

	public abstract updateItem (dataSource: string, targetHost?: string): Promise<number>;
    protected abstract getItemsFromMarketplace (dataSource: string, targetHost?: string): Promise<void>;
    protected abstract uploadItemData (params: any[], targetHost: string): Promise<any[]>;
    protected abstract setItemParam (params: any[]): Promise<any[]>;

	public abstract updateOrder(dataSource: string, targetHost?: string): Promise<number>;
    protected abstract getOrdersFromMarketplace(dataSource: string, targetHost?: string): Promise<void>;
    protected abstract uploadOrderData(params: any[], targetHost: string): Promise<any[]>;
    protected abstract setOrderParam (params: any[]): Promise<any[]>;
}
