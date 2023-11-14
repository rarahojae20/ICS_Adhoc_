import { Builder } from 'builder-pattern';
import { BaseDto } from '../base/base.dto';
import { FileDto } from './file.dto';
import { CsDto } from './customerservice.dto';

import { prune } from '../../lib/utils';

import { IBoard } from '../../types/board';
import { IFile } from '../../types/file';
import { ICombinedInterface } from '../../../src/types/core/noticecscomment';

export class BoardDto extends BaseDto<ICombinedInterface> {
    public noticeboard: ICombinedInterface;
  comments: Comment[];

    constructor(board: ICombinedInterface, files?: IFile[], index?: number) {
        super();


        const noticeBoardBuild = Builder<ICombinedInterface>()
            .type(board.type)
            ._id(board?._id)
            .comment_id(board?.comment_id)
            .author(board?.author)
            .title(board?.title)
            .content(board?.content)
            .order_no(board?.order_no)
            .seq(board?.seq)
            .created_at(board.created_at)
            .updated_at(board.updated_at)
            .deleted_at(board.deleted_at)
            .comments(board.comments)
            .files(files?.map((file) => {
                return new FileDto(file).file;
            }))
            .build();
            this.noticeboard = prune(noticeBoardBuild);
    
    
            // const csBoardBuild = Builder<ICombinedInterface>()
            // .type(board.type)
            // ._id(board?._id)
            // .author(board?.author)
            // .title(board?.title)
            // .content(board?.content)
            // .order_no(board?.order_no)
            // .seq(index)

            // .cs_type(board.cs_type)
            // .item_type(board.item_type)
            // .stock_type(board.stock_type)
            // .sku(board.sku)
            // .recipient_id(board.recipient_id)
            // .shipped_at(board.shipped_at)
            
            // .created_at(board?.created_at)
            // .updated_at(board?.updated_at)
            // .build();
            // this.board = prune(csBoardBuild);

        
    }
}

