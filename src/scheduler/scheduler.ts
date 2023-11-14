import schedule from 'node-schedule';
import Marketplace from '../marketplace';
import logger from '../lib/logger';
import ExchangeService from '../api/v1/exchange/exchange.service';
import Qoo10Service from '../marketplace/qoo10/qoo10.service';
import AwsSQS from "../lib/aws.sqs";
import FlightService from "../api/v1/flight/flight.service";

export default class Scheduler {
    private marketplace: Marketplace;

    private static getRandomDelay = (min, max) => {
        min = min * 60 * 1000;
        max = max * 60 * 1000;
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    public startJob = async () => {
        schedule.scheduleJob('0 0 * * *', async () => {

            const delayMinutes = Scheduler.getRandomDelay(0, 3);
            setTimeout(async () => {
                this.marketplace = new Qoo10Service();
                await this.marketplace.updateItem('remote');
                await this.marketplace.updateOrder('remote');
            }, delayMinutes);
        });

        schedule.scheduleJob('0,30 9-18 * * *', async () => {

            const delayMinutes = Scheduler.getRandomDelay(1, 5);
            setTimeout(async () => {
                const result = await new ExchangeService().getExchangeRate(); // 환율 정보 가져오기
                logger.debug('Scheduler result', result);
                await new ExchangeService().updateExchangeRate(result);
            }, delayMinutes);
        });

        schedule.scheduleJob('*/5 * * * *', async () => {

            const delayMinutes = Scheduler.getRandomDelay(0, 1);
            setTimeout(async () => {
                await new AwsSQS().processAndDeleteMessages(5);
            }, delayMinutes);
        });

        schedule.scheduleJob('0 */3 * * *', async () => {
            const delayMinutes = Scheduler.getRandomDelay(0, 3);

            try {
                setTimeout(async () => {
                    await new FlightService().getFlightScheduleByAirport('ICN');
                    await new FlightService().getFlightScheduleByAirport('GMP');
                }, delayMinutes);
            } catch (e: any) {
                logger.error(e);
            }
        });
    };
}
