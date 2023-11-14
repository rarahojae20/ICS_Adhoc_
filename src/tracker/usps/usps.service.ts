// /* eslint-disable no-extra-boolean-cast */
// import puppeteer from 'puppeteer';
// import Tracker from '..';

// import { env } from '../../env';
// import logger from '../../lib/logger';
// import TrackingStatus from '../../lib/tracking.status';

// import TrackingService from '../../api/v1/trackings/tracking.service';
// import { ITracking } from "../../types/core/tracking";
// import WaybillService from "../../api/v1/waybills/waybill.service";

// export default class UspsService extends Tracker {
//     public track = async(waybill_no: string): Promise<boolean> => {
//         const result = await this.crawlingUsps(waybill_no);
//         if (result.length <= 0) {
//             return null;
//         } else {
//             // 마지막에 있는 더보기에 대한 항목을 제거한다.
//             result.length > 1 ? result.pop() : null;
//         }
//         let isFinished = false;
//         for (const [index, detail] of result.entries()) {
//             const arr = detail
//                 .trim()
//                 .split('\t')
//                 .map(item => item.replace(/\n/g, '').replace(' ', ' '))
//                 .filter(item => item.length >= 1);

//             logger.debug('usps result:', arr);

//             if (arr.length > 1) {
//                 const param = await this.setTrackingParam(waybill_no, arr);
//                 await new TrackingService().create(param);

//                 if ((index === 0) && (param.status === TrackingStatus.DELIVERY_FINISH)) {
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

//     private crawlingUsps = async(waybill_no: string): Promise<string[]> => {
//         const browser = await puppeteer.launch({
//             headless: true,
//         });
//         const page = await browser.newPage();

//         try {
//             logger.debug('waybill_no:', waybill_no);
//             await page.goto(`${env.tracking.usps.url}?tLabels=${waybill_no}`);
//             await page.waitForSelector('#tracked-numbers > div > div > div > div > div.product_summary > div.row.row-wrapper.track-statusbar > div.col-md-6.col-sm-5.col-xs-12.current-tracking-status-wrapper > div');

//             const div = await page.$(
//                 '#tracked-numbers > div > div > div > div > div.product_summary > div.row.row-wrapper.track-statusbar > div.col-md-6.col-sm-5.col-xs-12.current-tracking-status-wrapper > div > div > div',
//             );

//             const elements = await div.$$eval('div', elements => elements.map(el => {
//                 return el.textContent.trim().replace(/\t\t/g, '').replace(/\n\n/g, '');
//             }));
//             await browser.close();
//             return elements.filter((element) => !element.includes('USPS Awaiting Item'));
//         } catch (error) {
//             logger.err(error);
//             logger.error(error);
//             await browser.close();
//             return [];
//         }
//     };
//     private setTrackingParam = async(waybill_no: string, arr: string[]): Promise<ITracking> => {
//         const param: ITracking = {
//             waybill_no:  waybill_no,
//             arrivals:    null,
//             check_point: null,
//             detail:      JSON.stringify(arr.join(' ')),
//             nation:      'USA',
//             courier:     'usps',
//             checked_at:  null,
//             status:      await this.setShippingStatus(arr[0]),
//         };

//         if (arr.length > 2) {
//             param.checked_at = await this.setShippingDate(arr[arr.length - 1], arr[arr.length - 2]);
//             param.check_point = arr[1];

//             if (arr[0].includes('Arrived')) {
//                 param.arrivals = arr[1];
//             }
//             if (param.status === TrackingStatus.DELIVERY_FINISH) {
//                 param.check_point = arr[2];
//                 param.arrivals = arr[2];
//             }
//             if (param.status === TrackingStatus.DELIVERY_FAILURE) {
//                 param.arrivals = null;
//                 param.check_point = 'Recovery Center';
//             }
//         } else {
//             param.checked_at = await this.setShippingDate(arr[arr.length - 1])
//         }

//         logger.debug('param:', param);
//         return param;
//     };

//     /**
//      * 추후에 크롤링 해오는 배송 상태에서 버그가 발생하면 여기서 수정한다.
//      *
//      * @param param
//      * @returns
//      */
//     private setShippingStatus = async(param: string): Promise<string> => {
//         if (param.includes('Delivered')) {
//             return TrackingStatus.DELIVERY_FINISH;
//         }

//         if (param.includes('Sent to Mail Recovery Center')) {
//             return TrackingStatus.DELIVERY_FAILURE;
//         }

//         if (param.includes('No Such Number')) {
//             return TrackingStatus.ADDRESS_ERROR;
//         }

//         if (param.includes('Return to Sender')) {
//             return TrackingStatus.BOUNCE;
//         }

//         if (param.includes('Accepted')) {
//             return TrackingStatus.DELIVERY_START;
//         }

//         return TrackingStatus.DELIVERY_IN_PROGRESS;
//     };

//     private setShippingDate = async(day: string, time?: string): Promise<Date> => {
//         return new Date(day.concat(' ', time || '00:00:00'));
//     };
// }
