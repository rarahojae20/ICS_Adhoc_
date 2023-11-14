import { IExchange } from '../../../types/exchange';

import { mysql } from '../../../lib/mysql';
import logger from '../../../lib/logger';

import { Exchange } from '../../../models/exchange.model';

export default class ExchangeRepository {
    public getExchanges = async() => {
        return await Exchange.findAll({
            attributes: [
                'currency_code',
                'nation_name',
                'receive_rate',
                'sand_rate',
                'sale_standard_rate',
                'book_value',
                'year_transit_interest_rate',
                'ten_day_transit_interest_rate',
                'korea_trading_standard_rate',
                'korea_book_value',
                'created_at',
                'updated_at'
            ]
        });
    };

	public getExchange = async(currency_code: string, nation_name: string) => {
        return await Exchange.findOne({
            where: {
                currency_code,
                nation_name,
            }
        });
    };

    public createExchange = async(param: IExchange) => {
        const transaction = await mysql.transaction();

        try {
            await Exchange.create(param, { transaction });
            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
        }
    };

    public updateExchange = async(param: IExchange) => {
        const transaction = await mysql.transaction();

        try {
            await Exchange.update(
                {
                    receive_rate: param.receive_rate,
                    sand_rate: param.sand_rate,
                    sale_standard_rate: param.sale_standard_rate,
                    book_value: param.book_value,
                    year_transit_interest_rate: param.year_transit_interest_rate,
                    ten_day_transit_interest_rate: param.ten_day_transit_interest_rate,
                    korea_trading_standard_rate: param.korea_trading_standard_rate,
                    korea_book_value: param.korea_book_value,
                    updated_at: new Date(),
                },
                {
                    where: {
                        currency_code: param.currency_code,
                        nation_name: param.nation_name,
                    },
                    transaction
                },
            );
            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
        }
    };
}
