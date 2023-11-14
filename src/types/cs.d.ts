export interface ICustomerService {
    _id?: number;
    type : 'board' | 'comment' | 'cs';
    order_no?: string;
    cs_type?: string;
    item_type?: string;
    stock_type?: string;
    sku?: string;
    
    recipient_id?: number;
    shipped_at?: Date;
    delivered_at?: Date;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
    
}


//board일떄 공지인지 코멘트인지 씨에스인지