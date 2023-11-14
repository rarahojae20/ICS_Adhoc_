import { Builder } from 'builder-pattern';
import { BaseDto } from '../base/base.dto';
import { FileDto } from './file.dto';
import { CsDto } from './customerservice.dto';

import { prune } from '../../lib/utils';

import { IBoard } from '../../types/board';
import { IFile } from '../../types/file';
import { ICustomerService } from '../../types/cs';
import { IShipper } from 'src/types/shipper';
import { IConsignee } from 'src/types/consignee';
import { OrderInvoice } from 'src/models/order_invoices.model';
import { IOrderInvoice } from 'src/types/Invoice';
import { IDelivery } from 'src/types/delivery';
import { ShipperDto } from './shipper.dto';
import { ConsigneeDto } from './consignee.dto';
import { OrderInvoiceDto } from './orderinvoice.dto';

export class DeliveryDto extends BaseDto<IDelivery> {
    public delivery: IDelivery;
//result,shipperServiceResult, consigneeServiceResult, order_invoiceServiceResult
    constructor(delivery: IDelivery, shipperServiceResult?: IShipper, consigneeServiceResult?: IConsignee, orderInvoiceServiceResult?: IOrderInvoice ,index?: number) {
        super();

        const { shipper } = new ShipperDto(shipperServiceResult);
        const { consignee } = new ConsigneeDto(consigneeServiceResult);
        const { orderInvoice } = new OrderInvoiceDto(orderInvoiceServiceResult);
        
        const shipperData = shipper;
        const consigneeData = consignee;
        const order_invoiceData = orderInvoice;


        const deliveryBuild = Builder<IDelivery>()
        .order_id(delivery.order_id)
        .shipper_id(delivery.shipper_id)
        .consignee_id(delivery.consignee_id)
        .order_invoice_id(delivery.order_invoice_id)
        .channel_hawbcode(delivery.channel_hawbcode)
        .transport_mode_code(delivery.transport_mode_code)
        .weight(delivery.weight)
        .weight_unit(delivery.weight_unit)
        .piece(delivery.piece)
        .declare_type(delivery.declare_type)
        .remark(delivery.remark)
        .created_at(delivery.created_at)
        .serverHawbcode(delivery.serverHawbcode)
            
        .shipper(shipperData)
        .consignee(consigneeData)
        .order_invoice(order_invoiceData)

            .created_at(delivery?.created_at)
            .build();

        this.delivery = prune(deliveryBuild);
    }
}
