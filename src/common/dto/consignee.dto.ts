import { Builder } from 'builder-pattern';
import { BaseDto } from '../base/base.dto';
import { ICustomerService } from '../../types/cs';
import { prune } from '../../lib/utils';
import { IShipper } from 'src/types/shipper';
import { IConsignee } from 'src/types/consignee';

export class ConsigneeDto extends BaseDto<IConsignee> {
    consignee: IConsignee;

    constructor(data: IConsignee) {
        super();

        const build = Builder<IConsignee>()
        .name(data.name)
        .ename(data.ename) 
        .company(data.company)
        .country_code(data.country_code)
        .province_name(data.province_name)
        .city_name(data.city_name) 
        .area_name(data.area_name)
        .address(data.address)
        .post_code(data.post_code)
        .mobile(data.mobile) 
        .phone(data.phone) 
        .email(data.email) 
        .certificate_type(data.certificate_type)
        .certificate_number(data.certificate_number)
        .build();
        this.consignee = prune(build);
    }
}



