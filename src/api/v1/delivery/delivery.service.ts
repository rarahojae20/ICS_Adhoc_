import { Builder } from 'builder-pattern';
import DeliveryRepository from './delivery.repositroy';
import FedexService from '../../../courier/fedex/fedex.service';
import { IConsignee } from '../../../../src/types/consignee';
import { IOrderInvoice } from '../../../../src/types/Invoice';
import { IShipper } from '../../../../src/types/shipper';
import { IDelivery } from '../../../../src/types/delivery';
import { DeliveryDto } from '../../../../src/common/dto/delivery.dto';
import ConsigneeService from '../consignee/consignee.service';
import OrderInvoiceService from '../orderinvoice/orderinvoice.service';
import ShipperService from '../shipper/shipper.service';
import { prune } from '../../../../src/lib/utils';
import YtoService from '../../../courier/yto/yto.service';
import ApiError from '../../../../src/lib/api.error';
import ApiCodes from '../../../../src/lib/api.codes';
import UspsService from '../../../../src/courier/usps/usps.service';
import ZtoService from '../../../../src/courier/zto/zto.service';
import EfsService from '../../../../src/courier/efs/efs.service';

export default class DeliveryService {
	public create = async (deliveryData: any, courier: string) => {
		let ret;

		switch (courier) {
		case 'fedex': 
		ret = await new FedexService().createShipment(deliveryData);
		break;
      case 'yto': 
        ret = await new YtoService().createShipment(deliveryData);
        break;
      case 'usps': 
        ret = await new UspsService().createShipment(deliveryData);
        break;
      case 'zto': 
        ret = await new ZtoService().createShipment(deliveryData);
		break;
	  case 'efs': //인증정보 없음
		ret = await new EfsService().newCreateShipment(deliveryData);
        break;
			default:
				throw new ApiError(ApiCodes.BAD_REQUEST, `Not supported courier: ${courier}`);
		}

		return ret;
	}
}