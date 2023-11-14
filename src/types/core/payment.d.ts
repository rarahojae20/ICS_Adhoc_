export interface IPayment {
    currency?: string;
    price?: string;
    discount?: string;
    total?: string;
    method?: string;
    payment_at?: Date;
}
