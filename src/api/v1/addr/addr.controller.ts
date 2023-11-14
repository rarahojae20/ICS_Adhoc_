import httpStatus from 'http-status';
import { Result } from '../../../common/result';
import logger from '../../../lib/logger';
import AddrService from './addr.service';
import { assertNotNull } from '../../../lib/utils';
import ApiError from '../../../lib/api.error';
import ApiCodes from '../../../lib/api.codes';
import ApiMessages from '../../../lib/api.messages';

export default class AddrController {
	public verifyAddress = async (req, res) => {
		const countryCode = req.params.country_code;
		const { address, postal_code: postalCode } = req.query;

		let result;
		try {
			const verifiedAddress = await new AddrService()
				.setCountryCode(countryCode)
				.setpostalCode(postalCode)
				.setAddress(address)
				.verifyAddress();

			result = Result.ok<Object>(verifiedAddress).toJson();
		} catch (e: any) {
			logger.err(e);
			logger.error(e);

			result = Result.fail<any>(e).toJson();
		}

		logger.res(httpStatus.OK, result, req);
		return res.status(httpStatus.OK).json(result);
	};

	public updateJPAddress = async (req, res) => {
		const agency: string = req.body?.agency;
		const file: Express.Multer.File = req.file;

		let result;
		try {
            assertNotNull(req.file, new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
                message: `No attached file..`
            }));

			assertNotNull(agency, new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
				message: `No agency..`
			}));

			const ret = await new AddrService().updateAddress(file, agency);

			result = Result.ok<object>(ret).toJson();
		} catch (e: any) {
			logger.err(e);
			logger.error(e);

			result = Result.fail<any>(e).toJson();
		}

		logger.res(httpStatus.OK, result, req);
		return res.status(httpStatus.OK).json(result);
	}
}
