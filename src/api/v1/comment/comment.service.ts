//comment.service.ts
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Builder } from 'builder-pattern';

import CommentRepository from './comment.repository';

import FileService from '../file/file.service';

import { ICombinedInterface } from '../../../../src/types/core/noticecscomment';
import { IFile } from '../../../types/file';

import { PaginationVo } from '../../../common/vo/pagination.vo';
import { CommentDto } from '../../../common/dto/comment.dto';
import { CommentsDto } from '../../../common/dto/comments.dto';

import ApiCodes from '../../../lib/api.codes';
import ApiError from '../../../lib/api.error';
import ApiMessages from '../../../lib/api.messages';
import ApiDetailCodes from '../../../lib/api.detail.codes';
import { assertNotNull, prune } from '../../../lib/utils';
import BoardRepository from '../board/board.repository';
import CsRepository from '../cs/cs.repository';

export default class CommentService {
    public list = async (param: PaginationVo, board_id: number, type: string): Promise<CommentsDto> => {
        assertNotNull(board_id, new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
            message: 'boardId variable does not exists',
            code: ApiDetailCodes.REQ_PARAM_EMPTY,
        }));

        const { rows, count } = await new CommentRepository().findAll(param, board_id, type);
        const response: ICombinedInterface[] = [];
        
        // 각 댓글당 파일이 여러개 있을 수 있음.
        for (const row of rows) {
            const where = {
                comment_id: row._id,
            };
        
            const files = await new FileService().list(where);
            response.push(new CommentDto(row, files).comment);
        }

        return new CommentsDto(count, board_id, response);
    };

    // const { type , author, content, board_id, } = req.body; // type은 'comment'로 전달됨, board_id는 보드 아이디 지정
    public create = async (body: any, file: any) => {
        console.log(body)

        const comment = Builder<ICombinedInterface>()
            .type(body.type) //type은 comment
            .board_id(body.board_id) // board_id를 parent_id로 사용
            .author(body.author)
            .content(body.content)
            .build();

        let files: IFile[];
        
        const comments = prune(comment)


        const existingBoard = await new CsRepository().findOne(comments.board_id);
        //        const existingBoard = await new CsRepository ().findOne(comments.board_id);

        if (!existingBoard) {
            throw new ApiError(ApiCodes.NOT_FOUND, 'Board not found', {
                code: ApiDetailCodes.ADDR_NOT_FOUND,
            });
        }
    
        const result = await new CommentRepository().create(comments);

        if (file && file.length > 0) {
            const where = {
                comment_id: result.getDataValue('_id'),
            };
            files = await new FileService().create(where, file);
        }
    
        return new CommentDto(result, files);
    };
}

