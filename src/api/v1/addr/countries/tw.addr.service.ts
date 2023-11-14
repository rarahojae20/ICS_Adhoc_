import ApiCodes from "../../../../lib/api.codes";
import ApiDetailCodes from "../../../../lib/api.detail.codes";
import ApiError from "../../../../lib/api.error";
import ApiMessages from "../../../../lib/api.messages";
import { assertTrue } from "../../../../lib/utils";
import puppeteer from "puppeteer";

export class TWAddrService {

	public verifyAddress = async ({ address, postalCode }) => {
		const length = 3; //TW postal code is 3 digits

		assertTrue(postalCode.length === length, new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
			code: ApiDetailCodes.REQ_PARAM_INVALID,
			message: `TW PostalCode Length should be '${length}`
		}));

		const webPostalCode = await this.getPostalCodeByAddress(address);
		const parsedWebPostalCode = webPostalCode.substring(0, length);

		assertTrue(parsedWebPostalCode === postalCode, new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
			code: ApiDetailCodes.REQ_PARAM_INVALID,
			message: `Invalid PostalCode! ${postalCode}`
		}));

		return {
			postal_code: parsedWebPostalCode,
			address: address,
		}
	}

	private getPostalCodeByAddress = async (address) => {
		const browser = await puppeteer.launch({headless: true});
		const page = await browser.newPage();
		const url = 'https://worldpostalcode.com/lookup';

		await page.goto(url);
		await page.type('#search', address);

		await page.click('body > div.header > div.search > form > input.submit');
		await page.waitForSelector('#map_canvas > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-popup-pane > div > div.leaflet-popup-content-wrapper > div > div.lookup_result > b', { visible: true });

		const element = await page.$('#map_canvas > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-popup-pane > div > div.leaflet-popup-content-wrapper > div > div.lookup_result > b');

		const webPostalCode = await page.evaluate(element => element.textContent, element);

		await page.close();
		await browser.close();

		return webPostalCode;
	}

}

