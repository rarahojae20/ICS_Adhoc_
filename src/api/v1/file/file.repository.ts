/* eslint-disable @typescript-eslint/no-explicit-any */
import { Op } from 'sequelize';

import { IFile } from '../../../types/file'

import { mysql } from '../../../lib/mysql';
import logger from '../../../lib/logger';

import { File } from '../../../models/file.model';

export default class FileRepository {
	public findAll = async(where: any): Promise<File[]> => {
		return await File.findAll({
            attributes: [
                '_id',
                'board_id',
                'comment_id',
                'storage',
            ],
            where: {
                ...where,
                deleted_at: {
                    [Op.eq]: null,
                },
            },
        });
	};

    public findOne = async(fileId: number): Promise<File> => {
		return await File.findOne({
            attributes: [
                '_id',
                'board_id',
                'comment_id',
                'storage',
            ],
            where: {
                
                _id: fileId,
                deleted_at: {
                    [Op.eq]: null,
                },
            },
        });
	};

    public create = async(param: IFile): Promise<File> => {
        const transaction = await mysql.transaction();

        let result: File;

        try {
            result = await File.create(param, { transaction });
            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
            result = null;
        }

        return result;
    };

    public delete = async(where: any): Promise<File[]> => {
        const files = await this.findAll(where);
        const transaction = await mysql.transaction();

        try {
            await File.destroy(
                {
                    where,
                    transaction
                },
            );

            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
        }

        return files;
    };
}
