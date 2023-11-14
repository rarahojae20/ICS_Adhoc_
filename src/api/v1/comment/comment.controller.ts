//comment.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { Result } from '../../../common/result';
import { PaginationVo } from '../../../common/vo/pagination.vo';
import { CommentDto } from '../../../common/dto/comment.dto';
import { CommentsDto } from '../../../common/dto/comments.dto';

import logger from '../../../lib/logger';
import CommentService from './comment.service';

export default class CommentController {
    // 댓글 목록 조회
    public list = async (req: Request, res: Response) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));
        
        const { type, boardId } = req.body;
        const { page, size, } = req.query;

        const parseBoardId = Number(boardId);
        const parseType = String(type); // type 변수를 string 타입으로 변환

        let response;

        try {
            const result = await new CommentService().list(new PaginationVo(Number(page), Number(size)), parseBoardId, parseType);
            response = Result.ok<CommentsDto>(result).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

    // 댓글 작성
    public create = async (req: Request, res: Response) => {
        console.log(req.body)
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));  



        const { type, board_id, author, content } = req.body; // type은 'comment'로 전달됨, board_id는 보드 아이디 지정
        const body = { type, board_id, author, content } 
        const files = req?.files;

        let response;

        try {
            const result = await new CommentService().create(body, files);
            response = Result.ok<CommentDto>(result).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };
}

