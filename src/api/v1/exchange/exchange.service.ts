/* eslint-disable @typescript-eslint/no-explicit-any */
import { Builder } from 'builder-pattern';

import ExchangeRepository from './exchange.repository';

import { env } from '../../../env';

import { IAxios } from '../../../types/axios';
import { IExchange } from '../../../types/exchange';

import Axios from '../../../lib/axios';
import { ExchangeDto } from '../../../common/dto/exchange.dto';

export default class ExchangeService {
    public getExchanges = async(): Promise<ExchangeDto> => {
        const exchange = await new ExchangeRepository().getExchanges();
        return new ExchangeDto(exchange, exchange[0].updated_at || exchange[0].created_at);
    };

    public getExchangeRate = async() => {
        const config = Builder<IAxios>()
            .method('get')
            .url(`${env.korea.exim.bank.url}exchangeJSON`)
            .params({
                authkey: env.korea.exim.bank.api.key,
                data: 'AP01' // AP01 : 환율, AP02 : 대출금리, AP03 : 국제금리
                // searchdate // 이 매개변수의 경우 없을 경우 기본값으로 오늘 날짜를 지정해준다고 함.
            })
            .build();

        return await Axios.setConfig(config).send();
    };

    public updateExchangeRate = async(params: any[]) => {
        for (const param of params) {
            const obj = Builder<IExchange>()
                .currency_code(param.cur_unit)
                .nation_name(param.cur_nm)
                .receive_rate(Number(param.ttb.replace(/\,/g, '')))
                .sand_rate(Number(param.tts.replace(/\,/g, '')))
                .sale_standard_rate(Number(param.deal_bas_r.replace(/\,/g, '')))
                .book_value(Number(param.bkpr.replace(/\,/g, '')))
                .year_transit_interest_rate(Number(param.yy_efee_r.replace(/\,/g, '')))
                .ten_day_transit_interest_rate(Number(param.ten_dd_efee_r.replace(/\,/g, '')))
                .korea_trading_standard_rate(Number(param.kftc_deal_bas_r.replace(/\,/g, '')))
                .korea_book_value(Number(param.kftc_bkpr.replace(/\,/g, '')))
                .build();

            const exchange = await new ExchangeRepository().getExchange(obj.currency_code, obj.nation_name);
            if (!exchange) {
                await new ExchangeRepository().createExchange(obj);
            } else {
                obj._id = exchange.getDataValue('_id');
                await new ExchangeRepository().updateExchange(obj);
            }
        }
    };
}
