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
import { IFedexDelivery } from '../../types/fedex';
import { assertNotNull } from '../../lib/utils';
import { DeliveryDto } from 'src/common/dto/delivery.dto';

export default class FedexService extends Courier {
	public track(tracking_no: string): Promise<any> {
		// TBU
		return null;
	}

	public async createShipment(delivery): Promise<any> {
		
		const token = await this.getAccessToken();
		const formedDelivery = this.setDeliveryParam(delivery);
		logger.debug(`formedDelivery : ${JSON.stringify(formedDelivery)}`);

		const config = Builder<IAxios>()
			.url(`${env.courier.fedex.url}/ship/v1/shipments`)
			.method('POST')
			.headers({
				'Content-Type': 'application/json',
				'x-locale': 'en_US',
				'Authorization': `Bearer ${token}`,
			})
			.data(delivery)
			.build();

		logger.debug(`config : ${JSON.stringify(config)}`);

		const result = await Axios.setConfig(config).send();
		if (result?.data?.errors) {
			console.log(result.data);
			throw new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
				message: result.data.errors,
			})
		}
		return result;
	}

	private setDeliveryParam = (delivery: any) => {
		const formedDelivery = Builder<IFedexDelivery>()
			.mergeLabelDocOption(delivery.mergeLabelDocOption)
			.requestedShipment(delivery.requestedShipment)//:
			.labelResponseOptions("LABEL") //:
			.accountNumber(delivery.accountNumber) //:
			.shipAction(delivery.shipAction)
			.processingOptionType(delivery.processingOptionType)
			.oneLabelAtATime(delivery.oneLabelAtATime)
			.build();

		return formedDelivery;
	}

	private getAccessToken = async (): Promise<any> => {
		const config = Builder<IAxios>()
			.url(`${env.courier.fedex.url}/oauth/token`)
			.method('POST')
			.headers({
				'Content-Type': 'application/x-www-form-urlencoded', 
			})
			.data({
				grant_type: 'client_credentials',
				client_id: env.courier.fedex.apikey,
				client_secret: env.courier.fedex.secret,
			})
			.build();

		const result = await Axios.setConfig(config).send();

		assertNotNull(result.access_token, new ApiError(ApiCodes.INTERNAL_SERVER_ERROR, ApiMessages.INTERNAL_SERVER_ERROR));

		return result?.access_token;
	}

}
