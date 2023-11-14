import { FlightSchedules } from "../../../models/flight_schedules.model";
import { mysql } from "../../../lib/mysql";
import logger from "../../../lib/logger";
import { Op } from "sequelize";
import moment from "moment";

export default class FlightRepository {
    getByFlightNumber = async (flightNumber: string): Promise<FlightSchedules[] | null> => {
        return await FlightSchedules.findAll({
            where: {
                flight_number: flightNumber,
                scheduled_off: {
                    [Op.gte]: moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss')
                }
            }
        });
    }

    findOrCreate = async (flightSchedule): Promise<FlightSchedules> => {
        const [result] = await FlightSchedules.findOrCreate({
            where: {
                flight_number: flightSchedule.flight_number,
                scheduled_off: flightSchedule.scheduled_off
            }, defaults: flightSchedule
        });

        return result;
    }

    saveBatch = async (flightSchedule, airportCode): Promise<FlightSchedules[]> => {
        const transaction = await mysql.transaction();
        let ret;

        try {
            const today = moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss');
            await FlightSchedules.destroy({
                where: {
                    scheduled_off: {
                        [Op.gte]: today
                    },
                    origin_airport: airportCode
                },
                transaction
            });

            ret = await FlightSchedules.bulkCreate(flightSchedule, {
                transaction
            });

            await transaction.commit();
            logger.log(`${airportCode} Airport Flight Schedule updated successfully.`);
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
        }

        return ret;
    }
}
