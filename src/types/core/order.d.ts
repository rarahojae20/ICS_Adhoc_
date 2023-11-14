import { ISeller } from './seller';
import { IShipment } from './shipment';
import { IPayment } from './payment';
import { ICart } from './cart';
import { ISender } from './sender';
import { IRecipient } from './recipient';
import { IPurchaser } from './purchaser';
import { IConsignment } from './consignment';
import { IOption } from './option';

export interface IOrder {
    waybill_no?: string;
    no?: string;
    type?: string;
    quantity?: number;
    packing_no?: string;
    tracking_no?: string;
    item_no?: string;
    item_name?: string;
    seller?: ISeller;
    shipment?: IShipment;
    payment?: IPayment;
    cart?: ICart;
    sender?: ISender;
    purchaser?: IPurchaser;
    recipient?: IRecipient;
    consignment?: IConsignment;
    option?: IOption;
    ordered_at?: Date;
}
