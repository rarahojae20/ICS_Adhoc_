/* eslint-disable @typescript-eslint/no-explicit-any */
import { Op } from 'sequelize';
import { mysql } from '../../../lib/mysql';
import logger from '../../../lib/logger';
import ApiError from '../../../lib/api.error';
import ApiCodes from '../../../lib/api.codes';
import ApiDetailCodes from '../../../lib/api.detail.codes';
import ApiMessages from '../../../lib/api.messages';
import { NoticeCsComment } from '../../../../src/models/noticecscomment.model';
import { ICombinedInterface } from '../../../../src/types/core/noticecscomment';
import { assertNotNull, prune } from '../../../lib/utils';

export default class CsRepository {


    public findAllForCustomerService = async (attr: any): Promise<{ rows: ICombinedInterface[]; count: number}> => {
        const size = attr.size || 100;
        const page = attr.page || 1;

        const where = {
            deleted_at: {
                [Op.eq]: null,
            },

            type: {
                [Op.eq]:'cs',
        }}

        const boards = await NoticeCsComment.findAll({
        
            where, //setCsAttr에서 Notice말고 Cs에서만 필요한 속성 삭제 return
            limit: size,
            offset: size * (page - 1),
            order: [['created_at', 'DESC']],
        });

        const count = await NoticeCsComment.count({
            where
        });


        return {
            rows: boards,
            count,
        };
    };


    public findOne = async (csId : number,): Promise<ICombinedInterface> => {
        // 'type' 컬럼이 'cs'인 레코드만 조회
         const csComment = await NoticeCsComment.findOne({
            where: {
                type: {
                    [Op.eq]: 'cs',
                },
                _id: csId,
            },        include: [
                {
                    model: NoticeCsComment,
                    as: 'comments', // 위에서 설정한 관계의 이름입니다.
                    where: {
                        type: 'comment',
                        board_id: csId
                    }
                }
            ]
            
        });        

        return csComment as ICombinedInterface
         
    }

    public create = async(param: ICombinedInterface): Promise<ICombinedInterface> => {
        const transaction = await mysql.transaction();
        let board: NoticeCsComment;
        try {
            board = await NoticeCsComment.create(param, { transaction });
            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
            board = null;
        }
        return board;
    };



    public update = async(param: ICombinedInterface): Promise<ICombinedInterface> => {
        const board = await this.findOne( param._id );
        assertNotNull(board, new ApiError(ApiCodes.NOT_FOUND, ApiMessages.NOT_FOUND, {
            code: ApiDetailCodes.BOARD_VALUE_NULL,
            message: `board NOT FOUND!! boardId is wrong: ${param._id}`
        }));
        
    const transaction = await mysql.transaction();
        try {
            await NoticeCsComment.update(
                {   
                    order_no: param.order_no,
                    author: param.author,
                    title: param.title,
                    content: param.content,
                    cs_type: param.cs_type,
                    item_type: param.item_type,
                    stock_type: param.stock_type,
                    sku: param.sku,
                    recipient_id: param.recipient_id,
                    shipped_at: param.shipped_at,
                    delivered_at: param.delivered_at,
                    created_at: param.created_at,
                    deleted_at: param.deleted_at,
                    updated_at: new Date(),
                    },
                {
                    where: {
                        _id: param._id,
                        type: 'cs'
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

    public delete = async(_id: number): Promise<ICombinedInterface> => {
        const cs = await this.findOne( _id );
        if (!cs) {
            throw new ApiError(ApiCodes.NOT_FOUND, ApiMessages.NOT_FOUND, {
                code: ApiDetailCodes.BOARD_VALUE_NULL,
                message: `customerservice NOT FOUND!! customerserviceId is wrong: ${_id}`
            });
        }

        const transaction = await mysql.transaction();
        try {
            await NoticeCsComment.update(
                {
                    deleted_at: new Date(),
                },
                {
                    where: {
                        _id,
                        deleted_at: {
                            [Op.eq]: null,
                        },
                        type:  'cs',

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

        return cs;



    };




}