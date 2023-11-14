// import { ICustomerService } from './cs';
// ? null, not null 바꿔야함

import { IConsignee } from "./consignee";
import { IOrderInvoice } from "./Invoice";
import { IShipper } from "./shipper";
//db에 추가
export interface IDelivery {
    order_id?: string;
    channel_hawbcode?: string;
    transport_mode_code?: string;
    weight: number; //DECIMAL?
    weight_unit: string;
    piece?: number;
    serverHawbcode?: string;

    declare_type?: number;
    remark: string;

    shipper_id: number;
    consignee_id:number;
    order_invoice_id:number;
    
    shipper: IShipper;
    consignee: IConsignee;
    order_invoice: IOrderInvoice;

    created_at?: Date;


}

