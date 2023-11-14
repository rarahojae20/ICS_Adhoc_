import httpStatus from 'http-status';
import { Result } from '../../../common/result';
import logger from '../../../lib/logger';
import FlightService from './flight.service';

export default class FlightController {
    public getFlightSchedule = async (req, res) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const flightNum = req.params.flightNumber as string;
        let response;
        let result;

        try {
            result = await new FlightService().getFlightScheduleByFlightNumber(flightNum);
            response = Result.ok<JSON>(result).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

}
