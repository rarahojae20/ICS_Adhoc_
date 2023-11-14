import { Courier } from '..';
import { env } from '../../env';
import ApiCodes from '../../lib/api.codes';
import ApiError from '../../lib/api.error';
import ApiDetailCodes from '../../lib/api.detail.codes';
import ApiMessages from '../../lib/api.messages';
import logger from '../../lib/logger';
import Axios from '../../lib/axios';
import { IAxios } from '../../types/axios';
import { Builder } from 'builder-pattern';
import { IYtoDelivery } from '../../../src/types/yto_delivery';
import { assertNotNull } from '../../lib/utils';
import crypto from 'crypto';



export default class YtoService extends Courier {
	public track(tracking_no: string): Promise<any> {
		// TBU
		return null;
	}

	public async createShipment(delivery: IYtoDelivery): Promise<any> {
		
		const formedDelivery = this.setDeliveryParam(delivery);
		const dataDigest = this.generateDataDigest(delivery, env.courier.yto.secret);

		const config = Builder<IAxios>()
		.url(`${env.courier.yto.url}`)
		.method('POST')
			.headers({
				'Content-Type': 'application/json',
				'data_digest': dataDigest,
				'partner_code': `${env.courier.yto.apikey}`,
				'msg_type': 'PLACE_ORDER',
				'msg_id': new Date().getTime().toString(),
			})
			.data(formedDelivery)
			.build();

		logger.debug(`config : ${JSON.stringify(config)}`);

		const data = await Axios.setConfig(config).send();
		return data;
	}

private setDeliveryParam = (delivery: any) => {
    const formedDelivery = Builder<IYtoDelivery>() 
	.orderId(delivery.orderId)
	.declareType(delivery.declareType)
	.orderInvoices(delivery.orderInvoices)
	.consignee(delivery.consignee)
	.shipper(delivery.shipper)
	.orderExtraServices(delivery.orderExtraServices)
	.transportModeCode(delivery.transportModeCode)
	.weight(delivery.weight)
	.weightUnit(delivery.weightUnit)
	.piece(delivery.piece)
	.remark(delivery.remark)
	.build();
    return formedDelivery;
}

private generateDataDigest(data: any, secretKey: string): string {
    const content = JSON.stringify(data);
    const message = content + secretKey;
    const md5Hash = crypto.createHash('md5').update(message).digest('base64');
    return md5Hash;
}
	} 