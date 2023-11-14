import { Builder } from 'builder-pattern';
import { FileDto } from './file.dto';

import { BaseDto } from '../base/base.dto';
import { prune } from '../../lib/utils';
import { ICombinedInterface } from '../../../src/types/core/noticecscomment';
import { IFile } from '../../../src/types/file';
import { CommentDto } from './comment.dto';
import { CommentsDto } from './comments.dto';

export class CsDto extends BaseDto<ICombinedInterface> {
    csBoard: ICombinedInterface;
    comments: CommentsDto;

    constructor(board: ICombinedInterface ,files: IFile[], index?: number) {
        super();


        const csBoardbuild = Builder<ICombinedInterface>()
            .type(board.type)
            .order_no(board.order_no)
            .comment_id(board.comment_id)
            .author(board.author)
            .title(board.title)
            .content(board.content)
            .author(board.author)
            ._id(board?._id)
            .cs_type(board?.cs_type)
            .item_type(board?.item_type)
            .stock_type(board?.stock_type)
            .sku(board?.sku)
            .order_no(board?.order_no)
            .recipient_id(board?.recipient_id)
            .shipped_at(board?.shipped_at)
            .delivered_at(board?.delivered_at)
            .updated_at(board.updated_at)
            .deleted_at(board.deleted_at)
            .comments(board.comments)
            .files(files?.map((file) => {
                return new FileDto(file).file;
            }))
            .build();

        this.csBoard = prune(csBoardbuild);
    }
}
