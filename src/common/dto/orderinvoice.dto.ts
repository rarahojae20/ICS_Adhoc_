import { Builder } from 'builder-pattern';
import { BaseDto } from '../base/base.dto';
import { ICustomerService } from '../../types/cs';
import { prune } from '../../lib/utils';
import { IShipper } from 'src/types/shipper';
import { IOrderInvoice } from 'src/types/Invoice';

export class OrderInvoiceDto extends BaseDto<IOrderInvoice> {
    orderInvoice: IOrderInvoice;

    constructor(data: IOrderInvoice) {
        super();

        const build = Builder<IOrderInvoice>()
        .sku(data.sku) 
        .ename(data.ename)
        .cname(data.cname)
        .quantity(data.quantity)
        .unit(data.unit)
        .specification(data.specification)
        .unit_price(data.unit_price) 
        .customs_ordination_no(data.customs_ordination_no)
        .remark(data.remark)
        .sale_addr(data.sale_addr)
        .currency_code(data.currency_code)
        .created_at(data.created_at)
        .build();        
        
        this.orderInvoice = prune(build);
    }
}
