import { ISeller } from './seller';
import { IShipment } from './shipment';
import { IContact } from './contact';
import { IProduct } from './product';
import { IPrice } from './price';

export interface IItem {
    no?: string;
    quantity?: number;
    state?: string;
    seller?: ISeller;
    shipment?: IShipment;
    contact?: IContact;
    product?: IProduct;
    price?: IPrice;
    listed_at?: Date;
    changed_at?: Date;
    expired_at?: Date;
}
