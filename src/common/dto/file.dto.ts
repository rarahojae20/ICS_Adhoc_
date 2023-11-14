import { Builder } from 'builder-pattern';
import { BaseDto } from '../base/base.dto';
import { IFile } from '../../types/file';
import { prune } from '../../lib/utils';

export class FileDto extends BaseDto<IFile> {
    file: IFile;

    constructor(data: IFile) {
        super();

        const build = Builder<IFile>()
            ._id(data?._id)
            .board_id(data?.board_id)
            .comment_id(data?.comment_id)
            .storage(data?.storage)
            .build();

        this.file = prune(build);
    }
}
