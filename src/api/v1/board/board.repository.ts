/* eslint-disable @typescript-eslint/no-explicit-any */
import { Op } from 'sequelize';

import { IBoard } from '../../../types/board';

import { mysql } from '../../../lib/mysql';
import logger from '../../../lib/logger';
import ApiError from '../../../lib/api.error';
import ApiCodes from '../../../lib/api.codes';
import ApiDetailCodes from '../../../lib/api.detail.codes';
import ApiMessages from '../../../lib/api.messages';
import { assertNotNull, prune } from '../../../lib/utils';
import { NoticeCsComment } from '../../../../src/models/noticecscomment.model';

import { Board } from '../../../models/board.model';
import { CustomerServiceModelIncludes } from '../../../models/common';
import { ICombinedInterface } from '../../../../src/types/core/noticecscomment';


export default class BoardRepository {
    /**
     * 공지사항을 불러오기
     *
     * @param param
     * @returns
     */
    // Cs_id가 없으면 Notice
public findAllForNotice = async (attr: any): Promise<{ rows: ICombinedInterface[]; count: number }> => {
    const size = attr.size || 20;
    const page = attr.page || 1;

    const where = {
        deleted_at: {
            [Op.eq]: null,
        },

        type: {
            [Op.eq]:'notice',
    }
    };

    const boards = await NoticeCsComment.findAll({
        where,
        limit: size,
        offset: size * (page - 1),
        order: [['created_at', 'DESC']],
    });

    const count = await NoticeCsComment.count({
        where,
    });


    return {
        rows: boards,
        count,
    };
};

    // /**
    //  * CS관리 불러오기
    //  *
    //  * @param orderNo
    //  * @returns
    //  */

    public findAllForCustomerService = async (attr: any): Promise<{ rows: ICombinedInterface[]; count: number}> => {
        const size = attr.size || 100;
        const page = attr.page || 1;

        const where = await this.setCsAttr(attr); //Cs에는 필요없는 속성 필터링ㅇㅁ

        const boards = await NoticeCsComment.findAll({
        
            where: prune(where), //setCsAttr에서 Notice말고 Cs에서만 필요한 속성 삭제 return
            limit: size,
            offset: size * (page - 1),
            order: [['created_at', 'DESC']],
        });

        const count = await NoticeCsComment.count({
            where: prune(where),
        });


        return {
            rows: boards,
            count,
        };
    };



    public findOne = async (boardId: number): Promise<NoticeCsComment> => {
        return await NoticeCsComment.findOne({
            where: {
                _id: boardId,
                type: 'notice'
            },
        });
    };
    



    public create = async(boardParam: ICombinedInterface): Promise<NoticeCsComment> => {
        const transaction = await mysql.transaction();
        let board: NoticeCsComment;

        try {
            board = await NoticeCsComment.create(boardParam, { transaction });
            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
            board = null;
        }

        return board;
    };

    public update = async(boardParam: ICombinedInterface): Promise<NoticeCsComment> => {
        const board = await this.findOne(boardParam._id);
        assertNotNull(board, new ApiError(ApiCodes.NOT_FOUND, ApiMessages.NOT_FOUND, {
            code: ApiDetailCodes.BOARD_VALUE_NULL,
            message: `board NOT FOUND!! boardId is wrong: ${boardParam._id}`
        }));

        const transaction = await mysql.transaction();
        try {
            await NoticeCsComment.update(
                {
                    order_no: boardParam.order_no,
                    deleted_at : boardParam.deleted_at,
                    created_at : boardParam.created_at,
                    author: boardParam.author,
                    title: boardParam.title,
                    content: boardParam.content,
                    updated_at: new Date(),
                },
                {
                    where: {
                        _id: boardParam._id,
                        type: 'notice'
                    },
                    transaction
                },
            );

            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
        }

        return board;
    };

    public delete = async(_id: number): Promise<NoticeCsComment> => {
        const board = await this.findOne(_id);
        assertNotNull(board, new ApiError(ApiCodes.NOT_FOUND, ApiMessages.NOT_FOUND, {
            code: ApiDetailCodes.BOARD_VALUE_NULL,
            message: `board NOT FOUND!! boardId is wrong: ${_id}`
        }));

        const transaction = await mysql.transaction();
        try {
            await NoticeCsComment.update(
                {
                    deleted_at: new Date(),
                },
                {
                    where: {
                        _id: _id,
                        deleted_at: {
                            [Op.eq]: null,
                        },
                        type: 'notice'
                    },

                    transaction
                },
            );

            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
        }

        return board;
    };

    private setCsAttr = async(attr: any): Promise<any> => {
        //page, size, type, from, to
        const where = {
            deleted_at: {
                [Op.eq]: null, //null인경우
            },
            type: {
                [Op.eq]:'cs',
            },

        };

        return where;
    };

      
      
    }