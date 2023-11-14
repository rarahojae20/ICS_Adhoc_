import { Router } from 'express';

import FlightController from './flight.controller';

export const path = '/flights';
export const router = Router();

router.get('/:flightNumber', new FlightController().getFlightSchedule); // 항공편명으로 스케줄 검색
