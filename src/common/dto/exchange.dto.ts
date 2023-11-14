import { Builder } from 'builder-pattern';
import { BaseDto } from '../base/base.dto';
import { prune } from '../../lib/utils';

import { IExchange } from '../../types/exchange';

export class ExchangeDto extends BaseDto<IExchange> {
    update_at: Date;
    exchanges: IExchange[];

    constructor(params: IExchange[], update_at: Date) {
        super();

        this.update_at = update_at;
        this.exchanges = params.map(param => {
            const build = Builder<IExchange>()
                .currency_code(param.currency_code)
                .nation_name(param.nation_name)
                .receive_rate(param.receive_rate)
                .sand_rate(param.sand_rate)
                .sale_standard_rate(param.sale_standard_rate)
                .book_value(param.book_value)
                .year_transit_interest_rate(param.year_transit_interest_rate)
                .ten_day_transit_interest_rate(param.ten_day_transit_interest_rate)
                .korea_trading_standard_rate(param.korea_trading_standard_rate)
                .korea_book_value(param.korea_book_value)
                .created_at(param.created_at)
                .updated_at(param.updated_at)
                .build();

            return prune(build);
        });
    }
}
