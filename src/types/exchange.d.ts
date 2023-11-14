export interface IExchange {
    _id?: number;
    currency_code?: string;
    nation_name?: string;
    receive_rate?: number;
    sand_rate?: number;
    sale_standard_rate?: number;
    book_value?: number;
    year_transit_interest_rate?: number;
    ten_day_transit_interest_rate?: number;
    korea_trading_standard_rate?: number;
    korea_book_value?: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
