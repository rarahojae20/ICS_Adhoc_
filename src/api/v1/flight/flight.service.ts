import { env } from '../../../env';
import { IAxios } from '../../../types/axios';
import Axios from '../../../lib/axios';
import { Builder } from 'builder-pattern';
import FlightRepository from './flight.repository';
import ApiError from '../../../lib/api.error';
import ApiCodes from '../../../lib/api.codes';
import moment from 'moment';
import logger from '../../../lib/logger';

export default class FlightService {
    public getFlightScheduleByFlightNumber = async (flightNumb: string) => {
        const result = await new FlightRepository().getByFlightNumber(flightNumb);
        if (result.length !== 0) return result;

        const reqUrl = this.setFlightApiUrl(`/flights/${flightNumb}`);
        const flightSchedules = await this.fetchFlightSchedule(reqUrl);

        if (flightSchedules.length === 0) {
            throw new ApiError(ApiCodes.NOT_FOUND, '항공편명으로 조회된 항목이 없습니다.');
        }

        let ret = [];
        for (const flightSchedule of flightSchedules) {
            const newInstance = await new FlightRepository().findOrCreate(flightSchedule);
            ret.push(newInstance);
        }

        return ret;
    };

    public getFlightScheduleByAirport = async (airportCode: string) => {
        const reqUrl = this.setFlightApiUrl(`/airports/${airportCode}/flights/scheduled_departures`);
        const flightSchedules = await this.fetchFlightSchedule(reqUrl);
        const ret = await new FlightRepository().saveBatch(flightSchedules, airportCode);
        return ret;
    }

    private async fetchFlightSchedule(reqUrl: string) {
        let url;
        let params = {};

        if (reqUrl.split("?").length > 1) {
            const [urlString, paramsString] = reqUrl.split("?");
            const paramsArray = paramsString.split("&");

            paramsArray.forEach(param => {
                const [key, value] = param.split("=");
                params[key] = decodeURIComponent(value);
            });

            url = urlString;
        } else {
            params = {
                start: moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
            }
            url = reqUrl;
        }

        const config = this.buildRequestConfig(url, params);
        logger.debug(`config: ${JSON.stringify(config, null, 2)}`);
        const result = await Axios.setConfig(config).send();
        const flights = result?.scheduled_departures || result?.flights || [];
        const flightSchedules = this.setScheduleInstance(flights);

        if (result?.links) {
            const nextUrl = this.setFlightApiUrl(result?.links?.next);
            const nextFlights = await this.fetchFlightSchedule(nextUrl);
            flightSchedules.push(...nextFlights);
        }
        return flightSchedules;
    }

    private buildRequestConfig(url: string, params: any) {
        return Builder<IAxios>()
            .method('get')
            .url(url)
            .headers({
                'Content-Type': 'application/json',
                'x-apikey': env.flight.api.key,
            })
            .params({
                ...params,
            })
            .build();
    }

    private setFlightApiUrl(params: string) {
        const url = `${env.flight.api.url}${params}`;
        return url;
    }

    private setScheduleInstance(flights: any[]) {
        const flightSchedules = flights.map((flight: any) => ({
            flight_number: flight.ident,
            origin_airport: flight.origin?.code_iata,
            dest_airport: flight.destination?.code_iata,
            filed_ete: flight.filed_ete,
            scheduled_out: flight.scheduled_out,
            estimated_out: flight.estimated_out,
            actual_out: flight.actual_out,
            scheduled_off: flight.scheduled_off,
            estimated_off: flight.estimated_off,
            actual_off: flight.actual_off,
            scheduled_on: flight.scheduled_on,
            estimated_on: flight.estimated_on,
            actual_on: flight.actual_on,
            scheduled_in: flight.scheduled_in,
            estimated_in: flight.estimated_in,
            actual_in: flight.actual_in,
            status: flight.status
        }));
        return flightSchedules;
    }
}
