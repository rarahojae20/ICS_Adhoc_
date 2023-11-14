// /* eslint-disable no-irregular-whitespace */
// /* eslint-disable no-extra-boolean-cast */
// import puppeteer from 'puppeteer';
// import Tracker from '..';
// import { env } from '../../env';
// import { ITracking } from '../../types/core/tracking';

// import logger from '../../lib/logger';
// import ApiCodes from '../../lib/api.codes';
// import ApiError from '../../lib/api.error';
// import ApiDetailCodes from '../../lib/api.detail.codes';
// import ApiMessages from '../../lib/api.messages';
// import TrackingStatus from '../../lib/tracking.status';

// import TrackingService from '../../api/v1/trackings/tracking.service';
// import WaybillService from "../../api/v1/waybills/waybill.service";

// export default class YamatoService extends Tracker {
//     public track = async(tracking_no: string): Promise<boolean> => {
//         const result = await this.crawlingYamato(tracking_no);
//         if (result.length <= 0) {
//             return null;
//         }

//         let isFinished = false;
//         for (const [index, detail] of result.entries()) {

//             const split = detail.trim().split('\n');
//             logger.debug('splitResult:', split);

//             if (split.length > 1) {
//                 const param = await this.setTrackingParam(tracking_no, split);
//                 logger.log(param);
//                 await new TrackingService().create(param);

//                 if (index == (result.length - 1) && (param.status === TrackingStatus.DELIVERY_FINISH)) {
//                     await new WaybillService().delete({
//                         waybill_no: param.waybill_no || param.local_waybill_no,
//                         courier: param.courier,
//                     });
//                     isFinished = true;
//                 }
//             }
//         }
//         return isFinished;
//     };

//     private crawlingYamato = async(tracking_no: string): Promise<string[]> => {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();

//         try {
//             logger.debug('tracking_no:', tracking_no);
//             await page.goto(`${env.tracking.yamato.url}`);
//             await page.waitForSelector('body > div.page-content > div.parts-tracking-box > form > div.tracking-box-body > div:nth-child(2) > div > div.cell-1 > div.data.number > input[type=text]');
//             await page.$eval(
//                 'body > div.page-content > div.parts-tracking-box > form > div.tracking-box-body > div:nth-child(2) > div > div.cell-1 > div.data.number > input[type=text]',
//                 (element, param) => element.value = param,
//                 tracking_no
//             );
//             await Promise.all([
//                 page.waitForNavigation(),
//                 page.click('button[name=category]'),
//             ]);

//             const checkElement = await page.$eval(
//                 'body > div.page-content > div.parts-tracking-invoice-block',
//                 data => data.textContent
//             );
//             if (checkElement.includes('伝票番号未登録')) {
//                 throw new ApiError(ApiCodes.NOT_FOUND, ApiMessages.NOT_FOUND, {
//                     code: ApiDetailCodes.YAMATO_TRACKING_NULL,
//                     message: `item hasn't arrived in Japan yet.`
//                 });
//             }

//             const element = await page.$eval(
//                 'body > div.page-content > div.parts-tracking-invoice-block > div.tracking-invoice-block-detail > ol',
//                 data => data.textContent
//             );
//             await browser.close();

//             const elements = element.trim().replace(/ /g, '').replace(/月/g, '-').replace(/日/g, ' ').split('\n\n');

//             return elements.filter((element) => element !== '');
//         } catch (error) {
//             logger.err(error);
//             logger.error(error);
//             await browser.close();
//             return [];
//         }
//     };

//     private setTrackingParam = async(waybill_no: string, split: string[]): Promise<ITracking> => {
//         const year = new Date().getFullYear();
//         // TypeError: Cannot set properties of undefined (setting 'arrivals')를 막기위해서 null로 선언.
//         // https://bobbyhadz.com/blog/javascript-cannot-set-property-of-undefined
//         const param: ITracking = {
//             waybill_no,
//             arrivals: null, // 출발지 설정해주는 부분은 추후에 설정하기
//             check_point: null,
//             detail: JSON.stringify(split.join(' ')),
//             nation: 'JAPAN',
//             courier: 'yamato',
//             checked_at: new Date(`${year}-${split[1].replace(' ', 'T')}:00`),
//             status: await this.setShippingStatus(split[0]),
//         };

//         if (split.length === 3) {
//             param.check_point = split[2];
//         }

//         logger.debug('param:', param);
//         return param;
//     };

//     private setShippingStatus = async(param: string): Promise<string> => {
//         if (param.includes('配達完了')) {
//             return TrackingStatus.DELIVERY_FINISH;
//         }

//         if (param.includes('荷物受付')) {
//             return TrackingStatus.DELIVERY_START;
//         }

//         return TrackingStatus.DELIVERY_IN_PROGRESS;
//     };
// }
