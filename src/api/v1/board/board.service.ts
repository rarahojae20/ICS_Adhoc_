/* eslint-disable no-case-declarations */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Builder } from 'builder-pattern';
import ExcelJS from 'exceljs';

import BoardRepository from './board.repository';

import FileService from '../file/file.service';
import CsService from '../cs/cs.service';

import { IBoard } from '../../../types/board';
import { ICustomerService } from '../../../types/cs';
import { IFile } from '../../../types/file';
import { NoticeCsComment } from '../../../../src/models/noticecscomment.model';

import { BoardDto } from '../../../common/dto/board.dto';
import { BoardsDto } from '../../../common/dto/boards.dto';

import ApiCodes from '../../../lib/api.codes';
import ApiError from '../../../lib/api.error';
import ApiMessages from '../../../lib/api.messages';
import ApiDetailCodes from '../../../lib/api.detail.codes';
import { assertNotNull, prune } from '../../../lib/utils';
import logger from '../../../lib/logger';
import { Op } from 'sequelize';
import bodyParser from 'body-parser';
import {ICombinedInterface } from '../../../../src/types/core/noticecscomment';
import { CsDto } from '../../../../src/common/dto/customerservice.dto';
import {ReturnDto } from '../../../../src/common/dto/returndto.dto';
import { Board } from '../../../../src/models/board.model';
import CsRepository from '../cs/cs.repository';
import ExcelService from '../excel/excel.generate';
import { NoticeHeaderColumnNames } from '../../../../src/lib/excel.common';

export default class BoardService {

//page, size, type, from, to, order_no, title, author 가 전달됨
    public list = async (attr: any): Promise<BoardsDto> => {
        let count = 0;
        let boards: ICombinedInterface[] = [];

        const boardRepository = new BoardRepository();
                const notice = await boardRepository.findAllForNotice(prune(attr));
                boards = notice.rows;
                count = notice.count;

                
        return new BoardsDto(count, boards, { //페이징 
            page: attr.page,
            size: attr.size,
        });

    };


    public get = async(boardId: number ,parseType: string): Promise<BoardDto> => {
		let board; 
        
        if (parseType == 'notice'){
         board = await new BoardRepository().findOne(boardId);
        }
        
        
        assertNotNull(board, new ApiError(ApiCodes.NOT_FOUND, ApiMessages.NOT_FOUND, {
            code: ApiDetailCodes.REQ_PARAM_INVALID,
            message: 'invalid board'
        }));

        const files = await new FileService().list(boardId);//맞느지? 정확히안봄

        return new BoardDto(board, files); 
	};




    public create = async(body: any, file: any) => {
        
        const noticeBoard = Builder<ICombinedInterface>()
            .type(body.type)
            .order_no(body.order_no)
            .author(body.author)
            .title(body.title)
            .content(body.content)
            .created_at(body.created_at)
            .updated_at(body.updated_at)
            .deleted_at(body.deleted_at)
            .build();

   

        const notice = prune(noticeBoard);
        let files: IFile[];

        // assertNotNull(board?.author && board?.title, new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
        //     message: 'author, title variable does not exists',
        // ode: ApiDetailCodes.REQ_PARAM_EMPTY,
        // }));

        let boardResult: ICombinedInterface

            boardResult = await new BoardRepository().create(notice);
		return new BoardDto(boardResult, file);
	};



    public update = async (boardId: number, body: any, files: any): Promise<BoardDto | CsDto> => {
        
        console.log(boardId)
        const updateOption = await new BoardRepository().findOne(boardId);

        if (!updateOption) {
            throw new Error(`ID가 ${boardId}인 보드를 찾을 수 djq읍.`);
        }
            
            const noticeBoard = Builder<ICombinedInterface>()
                .type('notice')
                ._id(boardId)
                .order_no(body.order_no)
                .author(body.author)
                .title(body.title)
                .content(body.content)
                .created_at(body.created_at)
                .updated_at(body.updated_at)
                .deleted_at(body.deleted_at)
                .build();
    
                const notice = prune(noticeBoard);
                
                

                let boardResult: ICombinedInterface


        
        boardResult = await new BoardRepository().update(notice);

        if (files && files.length > 0) {
            const where = {
                board_id: boardResult._id,
            };
            await new FileService().update(where, files);
        }
    
        return new BoardDto(boardResult, files);
    };
            



    public delete = async(_id: number): Promise<BoardDto | CsDto> => {
        let board
        board = await new BoardRepository().delete(_id);
        const where = {
            board_id: board._id
        };
        const files = await new FileService().delete(where);

		return new CsDto(board, files);
	};

public async downloadExcel(attr: any): Promise<Buffer> {
    try {
        const data = await new BoardRepository().findAllForNotice(attr);
        const requiredFields = ["_id", "author", "title", "content", "order_no", "created_at"];
    
        const excelBuffer = await new ExcelService().generateExcel(data.rows, requiredFields);
    
        return excelBuffer;
    } catch (error) {
        // 오류 처리
        throw new Error("Failed to generate Excel file.");
    }
}
}