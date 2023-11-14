export interface IShipment {
    code?: string;
    country?: string;
    carrier?: string;
    state?: string;
    rate?: number;
    est_shipping_at?: Date;
    shipping_at?: Date;
    delivered_at?: Date;
}
