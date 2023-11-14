/* eslint-disable @typescript-eslint/no-explicit-any */
import { Op, Sequelize } from 'sequelize';
import { Hscodes } from '../../../models/hscodes.model';
import { PaginationVo } from '../../../common/vo/pagination.vo';

export default class HscodeRepository {
    public list = async(param: PaginationVo) => {
        const result = await Hscodes.findAndCountAll({
            where: {
                deleted_at: {
                    [Op.eq]: null,
                },
            },
            limit: param.size,
            offset: param.size * (param.page - 1)
        });
        return result;
    }

    public search = async(param: PaginationVo, q) => {
        const result = await Hscodes.findAndCountAll({
            where: {
                [Op.or]: [
                    Sequelize.where(
                        Sequelize.fn(
                            'JSON_CONTAINS',
                            Sequelize.col('keyword'),
                            Sequelize.literal(`'["${q}"]'`)
                        ),
                        {
                            [Op.eq]: 1,
                        }
                    ),
                    {
                        hscode: {
                            [Op.like]: `%${q}%`
                        }
                    },
                    {
                        chapter_kr: {
                            [Op.like]: `%${q}%`
                        }
                    },
                    {
                        heading_kr: {
                            [Op.like]: `%${q}%`
                        }
                    },
                    {
                        item_name_kr: {
                            [Op.like]: `%${q}%`
                        }
                    },
                    {
                        section_kr: {
                            [Op.like]: `%${q}%`
                        }
                    },
                    {
                        chapter_en: {
                            [Op.like]: `%${q}%`
                        }
                    },
                    {
                        heading_en: {
                            [Op.like]: `%${q}%`
                        }
                    },
                    {
                        item_name_en: {
                            [Op.like]: `%${q}%`
                        }
                    },
                    {
                        section_en: {
                            [Op.like]: `%${q}%`
                        }
                    },
                ],
                deleted_at: {
                    [Op.eq]: null,
                },
            },
            limit: param.size,
            offset: param.size * (param.page - 1)
        });

        return result;
    }

    public updateKeyword = async(hscode, keywords) => {
        const result = await Hscodes.update({
            keyword: keywords
        }, {
            where: {
                hscode
            }
        });

        return result;
    }
}
