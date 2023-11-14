//comment.repository.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Op } from 'sequelize';

import { IComment } from '../../../types/comment';

import { PaginationVo } from '../../../common/vo/pagination.vo';

import { mysql } from '../../../lib/mysql';
import logger from '../../../lib/logger';

import { NoticeCsComment } from '../../../../src/models/noticecscomment.model';
import { ICombinedInterface } from '../../../../src/types/core/noticecscomment';

export default class CommentRepository {
    public findAll = async (param: PaginationVo, board_id: number, type: string): Promise<{ rows: NoticeCsComment[]; count: number }> => {
        const size = param.size || 20;
        const page = param.page || 1;

        const comments = await NoticeCsComment.findAll({
            where: {
                deleted_at: {
                    [Op.eq]: null,
                },
                
                board_id: board_id, // 게시물의 board_id와 동일한 값으로 필터링
                type: 'comment', // 댓글의 타입이 comment로 일치하는 레코드만 가져옴
            },
            limit: size,
            offset: size * (page - 1),
        });

        const count = await NoticeCsComment.count({
            where: {
                deleted_at: {
                    [Op.eq]: null,
                },
                _id: board_id,
                type: 'comment',
            },
        });

        return {
            rows: comments,
            count,
        };
    };

    public create = async (param: ICombinedInterface): Promise<ICombinedInterface> => {
        const transaction = await mysql.transaction();
        let comment: NoticeCsComment;
        try {
            comment = await NoticeCsComment.create(param, { transaction });
            await transaction.commit();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {

            logger.error(e);
            await transaction.rollback();
            comment = null;
        }

        return comment;
    };
}
