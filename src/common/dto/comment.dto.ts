import { Builder } from 'builder-pattern';
import { BaseDto } from '../base/base.dto';
import { FileDto } from './file.dto';

import { prune } from '../../lib/utils';

import { IFile } from '../../types/file';
import { ICombinedInterface } from '../../../src/types/core/noticecscomment';

export class CommentDto extends BaseDto<ICombinedInterface> {
    public comment: ICombinedInterface;

    constructor(comment: ICombinedInterface, files?: IFile[]) {
        super();

        const commentBuild = Builder<ICombinedInterface>()
            .type(comment?.type)
            ._id(comment?._id)
            .board_id(comment?.board_id)
            .author(comment?.author)
            .content(comment?.content)
            .files(files?.map((file) => {
                return new FileDto(file).file;
            }))
            .created_at(comment?.created_at)
            .build();

        this.comment = prune(commentBuild);
    }
}
