import { IFile } from './file';

export interface IComment {
    _id?: number;
    board_id: number;
    author: string;
    content: string;

    files?: IFile[];

    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
