//board.controller.ts
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Readable } from 'stream'; // Readable을 가져옵니다.

import { Result } from '../../../common/result';
import { PaginationVo } from '../../../common/vo/pagination.vo';
import { BoardDto } from '../../../common/dto/board.dto';
import { BoardsDto } from '../../../common/dto/boards.dto';

import ApiError from '../../../lib/api.error';
import ApiCodes from '../../../lib/api.codes';
import ApiDetailCodes from '../../../lib/api.detail.codes';
import ApiMessages from '../../../lib/api.messages';
import logger from '../../../lib/logger';
import { getDateRangeCondition } from '../../../lib/utils';

import BoardService from './board.service';
import { CsDto } from '../../../../src/common/dto/customerservice.dto';
import bodyParser from 'body-parser';
import CsService from '../cs/cs.service';

export default class BoardController {
    
    public list = async (req: Request, res: Response) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { page, size, type, from, to, order_no, title, author,} = req.query;
        const parseType = String(type); 
        let response;

        try { //from , to ,,,, page ,size,,,type, order_no , title, author 는 getDateRangeCondition
            const attr = await getDateRangeCondition(from, to, {
                ...new PaginationVo(Number(page), Number(size)),
                order_no,
                title,
                author,
                parseType
                
            }); //getDateRangeCondition 에서 이것들을 attr로 리턴해옴 

            const result = await new BoardService().list(attr);
            response = Result.ok<BoardsDto>(result).toJson(); 

            
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };


//board.controller.ts
    public get = async (req: Request, res: Response) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { boardId } = req.params;
        const { type } = req.body
        // const parseType = String(type);
        const parseBoardId = Number(boardId);
        let response;

        const result = await new BoardService().get(parseBoardId ,type);
            response = Result.ok<BoardDto>(result).toJson();
   

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };



    // /**
    //  * 어떤 사용자가 글을 썼고, 그 글을 추가하기 위해서는 글쓴이가 추가를 요청해야 함.
    //  * 인증에 대한 부분이 Core에 있으니, 그 부분의 연동이 필요함.
    //  *
    //  * @param req
    //  * @param res
    //  */
    public create = async(req: Request, res: Response) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));


        const body = req.body; //type
        const files = req?.files;
        let response;

        try {
            const result = await new BoardService().create(body, files); //여기서 notice인지 cs인지확
            response = Result.ok(result).toJson(); // //boardDto? csDto?
        } 
        catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

    /**
     * 어떤 사용자가 글을 썼고, 그 글을 수정하기 위해서는 글쓴이가 수정을 요청해야 함.
     * 인증에 대한 부분이 Core에 있으니, 그 부분의 연동이 필요함.
     *
     * @param req
     * @param res
     */
    public update = async(req: Request, res: Response) => { //params.id, body
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { boardId } = req.params;
        const body = req.body;
        const files = req?.files;
        const parseBoardId = Number(boardId);
        let response;

        try {
            const result = await new BoardService().update(parseBoardId, body, files);
            response = Result.ok<BoardDto | CsDto>(result).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

    /**
     * 어떤 사용자가 글을 썼고, 그 글을 삭제하기 위해서는 글쓴이가 삭제를 요청해야 함.
     * 인증에 대한 부분이 Core에 있으니, 그 부분의 연동이 필요함.
     *
     * @param req
     * @param res
     */
    public delete = async(req: Request, res: Response) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { boardId } = req.params;
        const parseBoardId = Number(boardId);
        let response;
        let optionResult;

        try {
            if (isNaN(parseBoardId)) {
                throw new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
                    code: ApiDetailCodes.REQ_PARAM_INVALID,
                    message: 'boardId is NaN'
                });
            }
            // const deleteOption = await new BoardService().get(parseBoardId);
            // let optionResult = Result.ok<BoardDto | CsDto>(deleteOption).toJson();
            
            
            const result = await new BoardService().delete(parseBoardId);
            response = Result.ok<BoardDto | CsDto >(result).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

//board.controller.ts
public downloadExcel = async (req: Request, res: Response) => {
    const { page, size, type, from, to, order_no, title, author } = req.query;
    const parseType = String(type); 
    
    try {
        const attr = await getDateRangeCondition(from, to, {
            ...new PaginationVo(Number(page), Number(size)),
            order_no,
            title,
            author,
            parseType
        });

       const excelBuffer = await new BoardService().downloadExcel(attr);
        
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.set('Content-Disposition', 'attachment; filename=board_data.xlsx');

        const stream = new Readable({
            read() {
                this.push(excelBuffer);
                this.push(null);
            },
        });

        stream.pipe(res);
        stream.on('end', () => {
            console.log('Stream ended'); // 스트림 끝나는 이벤트 처리
        });
        //Readable스트림 상태 나타나는 정보가 있는데 


    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to generate Excel file.' });
    }
};
}

