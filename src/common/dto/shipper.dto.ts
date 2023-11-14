import { Builder } from 'builder-pattern';
import { BaseDto } from '../base/base.dto';
import { ICustomerService } from '../../types/cs';
import { prune } from '../../lib/utils';
import { IShipper } from 'src/types/shipper';

export class ShipperDto extends BaseDto<IShipper> {
    shipper: IShipper;

    constructor(data: IShipper) {
        super();

        const build = Builder<IShipper>()
        .name(data.name)
        .company(data.company)
        .country_code(data.country_code)
        .province_name(data.province_name)
        .city_name(data.city_name)
        .address(data.address)
        .post_code(data.post_code)
        .area_name(data.area_name)
        .mobile(data.mobile)
        .phone(data.phone)
        .email(data.email)
        .build();

        this.shipper = prune(build);
    }
}
