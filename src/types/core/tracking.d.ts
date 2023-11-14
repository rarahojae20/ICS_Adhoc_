export interface ITracking {
    _id?: number;
    order_id?: number | string;
    waybill_no?: string;
    local_waybill_no?: string;
    check_point?: string;
    departures?: string;
    arrivals?: string;
    courier?: string;
    nation?: string;
    status?: string;
    detail?: string;
    checked_at?: Date;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
