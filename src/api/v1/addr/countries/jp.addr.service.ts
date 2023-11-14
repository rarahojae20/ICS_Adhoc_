import { assertNotNull, assertTrue } from "../../../../lib/utils";
import { JP_Address } from "../../../../models/jp_address.model";
import ApiCodes from "../../../../lib/api.codes";
import ApiDetailCodes from "../../../../lib/api.detail.codes";
import ApiError from "../../../../lib/api.error";
import ApiMessages from "../../../../lib/api.messages";

export class JPAddrService{

	public verifyAddress = async ({ address, postalCode }) => {
		const length = 7; //JP postal code is 7 digits

		assertTrue(postalCode.length === length, new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
			code: ApiDetailCodes.REQ_PARAM_INVALID,
			message: `JP PostalCode Length should be '${length}`
		}));

		const exists = await JP_Address.findOne({ where: { postal_code: postalCode } });

		assertNotNull(exists, new ApiError(ApiCodes.NOT_FOUND, ApiMessages.NOT_FOUND, {
			code: ApiDetailCodes.ADDR_NOT_FOUND,
			message: `Cannot find PostalCode(${postalCode}) in database.`
		}));

		this.checkJPAddressByDB(address, exists);
		return exists;
	}

	private checkJPAddressByDB = (address, db) => {
		const { prefecture, municipality, prefecture_hi, municipality_hi, town_area, town_area_hi } = db;

		const validPrefecture = address.includes(prefecture) || address.includes(prefecture_hi);
		const validMunicipality = address.includes(municipality) || address.includes(municipality_hi);
		const validTownArea = address.includes(town_area) || address.includes(town_area_hi);

		assertTrue(validPrefecture || validMunicipality || validTownArea, new ApiError(ApiCodes.NOT_FOUND, ApiMessages.NOT_FOUND, {
			code: ApiDetailCodes.ADDR_NOT_FOUND,
			message: `Cannot find Address(${address}) in database.`
		}));
	}
}
