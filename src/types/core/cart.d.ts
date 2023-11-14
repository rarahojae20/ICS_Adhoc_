import { IDiscount } from './discount';

export interface ICart {
    no?: string;
    discount?: IDiscount;
}
