import { Op } from 'sequelize';
import { Exports } from '../../../models/exports.model';

export default class ExportRepository {
    public getInvcList = async() => {
        const result = await Exports.findAll({
            where: {
                invoice_no: {
                    [Op.ne]: null,
                },
                deleted_at: {
                    [Op.eq]: null,
                },
            }
        });
        return result;
    }

    public getOrderList = async() => {
        const result = await Exports.findAll({
            where: {
                order_no: {
                    [Op.ne]: null,
                },
                deleted_at: {
                    [Op.eq]: null,
                },
            }
        });
        return result;
    }

    public register = async(param: any) => {
        const result = await Exports.create(param);
        return result;
    }

}
