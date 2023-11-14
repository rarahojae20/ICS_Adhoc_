export interface IOrderInvoice {
    invoice_id?: number;
    order_id?: string;
    sku?: string;
    ename?: string;
    cname?: string;
    quantity?: number;
    unit?: string;
    specification?: string;
    unit_price?: number;
    customs_ordination_no?: string;
    remark?: string;
    sale_addr?: string;
    currency_code?: string;
    created_at?: Date;
}
