/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICombinedInterface } from 'src/types/core/noticecscomment';
import CsRepository from './cs.repository';
import { BoardsDto } from '../../../../src/common/dto/boards.dto';
import { assertNotNull, prune } from '../../../lib/utils';
import { Builder } from 'builder-pattern';
import { IFile } from '../../../../src/types/file';
import { CsDto } from '../../../../src/common/dto/customerservice.dto';
import ApiError from '../../../../src/lib/api.error';
import ApiCodes from '../../../../src/lib/api.codes';
import ApiDetailCodes from '../../../../src/lib/api.detail.codes';
import ApiMessages from '../../../../src/lib/api.messages';
import FileService from '../file/file.service';
import ExcelService from '../excel/excel.generate';
import { CsHeaderColumnNames } from '../../../../src/lib/excel.common';

export default class CsService {

    public list = async (attr:any): Promise<BoardsDto> => {
        let count = 0;
        let boards : ICombinedInterface[] = [];

        const cs = await new CsRepository().findAllForCustomerService(prune(attr));
        //row에 cs.rows의배열들 삽입
        boards = cs.rows;
        count = cs.count;
    
        return new BoardsDto(count, boards, { //페이징 
            page: attr.page,
            size: attr.size,
        });
}

public create = async(body: any, file: any) => {
    
    let csResult: ICombinedInterface

    const csBoard = Builder<ICombinedInterface>()
        .type(body.type) 
        .order_no(body.order_no)
        .author(body.author)
        .title(body.title)
        .content(body.content)
        .cs_type(body.cs_type)
        .item_type(body.item_type)
        .stock_type(body.stock_type)
        .sku(body.sku)
        .recipient_id(body.recipient_id)
        .shipped_at(body.shipped_at)
        .delivered_at(body.delivered_at)
        .created_at(body.created_at)
        .updated_at(body.updated_at)
        .deleted_at(body.deleted_at)
        .build();

        const customerservice = prune(csBoard);
        let files: IFile[];

        csResult = await new CsRepository().create(customerservice);
        return new CsDto(csResult, file);
};

    public get = async(csId: number , type: string): Promise<CsDto> => {
    let cs
    if (type === 'cs'){
        cs = await new CsRepository().findOne(csId);
       }
    assertNotNull(cs, new ApiError(ApiCodes.NOT_FOUND, ApiMessages.NOT_FOUND, {
        code: ApiDetailCodes.REQ_PARAM_INVALID,
        message: 'invalid board'
    }));
    const files = await new FileService().list(csId);//맞느지? 정확히안봄

    return new CsDto(cs, files); 
};

public update = async (csId: number, body: any, files: any): Promise< CsDto> => {
        
    console.log(csId)
    const updateOption = await new CsRepository().findOne(csId);

    if (!updateOption) {
        throw new Error(`ID가 ${csId}인 보드를 찾을 수 djq읍.`);
    }
        const csBoard = Builder<ICombinedInterface>()
            .type('cs')
            ._id(csId) //id를 추가해서 update의 where로 넘어감
            .order_no(body.order_no)
            .author(body.author)
            .title(body.title)
            .content(body.content)
            .cs_type(body.cs_type)
            .item_type(body.item_type)
            .stock_type(body.stock_type)
            .sku(body.sku)
            .recipient_id(body.recipient_id)
            .shipped_at(body.shipped_at)
            .delivered_at(body.delivered_at)
            .created_at(body.created_at)
            .updated_at(body.updated_at)
            .deleted_at(body.deleted_at)
            .build();

            const customerservice = prune(csBoard);
            

    let csResult: ICombinedInterface

    csResult = await new CsRepository().update(customerservice);
    
    if (files && files.length > 0) {
        const where = {
            board_id: csResult._id,
        };
        await new FileService().update(where, files);
    }

    return new CsDto(csResult, files);
};
        
public delete = async(csId: number): Promise<CsDto> => {
    let cs

    const deleteOption = await new CsRepository().findOne(csId);        

    if (!deleteOption) {
        assertNotNull(deleteOption, new ApiError(ApiCodes.NOT_FOUND, ApiMessages.NOT_FOUND, {
            code: ApiDetailCodes.REQ_PARAM_INVALID,
            message: 'invalid cs'
        }));
    }

    cs = await new CsService().delete(csId);
    
    
    const where = {
        board_id: cs._id
    };
    const files = await new FileService().delete(where);

    return new CsDto(cs, files);
};

public async downloadExcel(attr: any): Promise<Buffer> {
    try {

        const data = await new CsRepository().findAllForCustomerService(prune(attr));

        const requiredFields = ["_id", "author", "title", "content", "order_no", "created_at", "cs_type", "item_type", "stock_type", "sku", "recipient_id"];    
        
        const excelBuffer = await new ExcelService().generateExcel(data.rows, requiredFields);
    
        return excelBuffer;
    } catch (error) {
        // 오류 처리
        throw new Error("Failed to generate Excel file.");
    }
}

}

