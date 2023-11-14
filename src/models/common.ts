import { Op } from 'sequelize';

import { Comment } from './comment.model';
import { File } from './file.model';
import { CS } from './cs.model';

export const CustomerServiceModelIncludes = [
    {
        model: Comment,
        required: false,
        where: {
            deleted_at: {
                [Op.eq]: null,
            },
        },
    },
    {
        model: File,
        required: false,
        where: {
            deleted_at: {
                [Op.eq]: null,
            },
        },
    },
    {
        model: CS,
        required: false,
        where: {
            deleted_at: {
                [Op.eq]: null,
            },
        },
    },
];
