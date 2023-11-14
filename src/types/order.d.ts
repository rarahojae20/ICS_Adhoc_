export interface AdhocOrder {
    _id?: number;
    marketplace?: string;
    order_no?: string;
    seller_name?: string;
    payload: object;
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
