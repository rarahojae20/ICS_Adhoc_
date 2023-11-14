/* eslint-disable @typescript-eslint/no-explicit-any */
import { Op } from 'sequelize';
import { Taxs } from '../../../models/taxs.model';

export default class TaxRepository {
    public get = async(hscode) => {
        const result = await Taxs.findAndCountAll({
            where: {
                hscode,
                deleted_at: {
                    [Op.eq]: null,
                },
            }
        })

        return result;
    }
}
