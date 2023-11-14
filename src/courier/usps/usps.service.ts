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
import { IUspsDelivery } from '../../../src/types/usps';



export default class UspsService extends Courier {
	public track(tracking_no: string): Promise<any> {
		// TBU
		return null;
	}  

	public async createShipment(delivery): Promise<any> {
		
		const formedDelivery = this.setDeliveryParam(delivery);

		const config = Builder<IAxios>()
		.url(`${env.courier.usps.url}/v1/shipments`)
		.method('POST')
			.headers({
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${env.courier.usps.token}`
			})
			.data(formedDelivery)
			.build();

		logger.debug(`config : ${JSON.stringify(config)}`);

		const data = await Axios.setConfig(config).send();
		return data;
	}

private setDeliveryParam = (delivery: any) => {
    const formedDelivery = Builder<IUspsDelivery>()
    .shipment(delivery.shipment)
    .build();
    return formedDelivery;
	}
} 


