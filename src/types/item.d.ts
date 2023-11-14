export interface AdhocItem {
    _id?: number;
    marketplace?: string;
    item_no?: string;
    seller_code?: string;
    seller_name?: string;
    payload: object;
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
