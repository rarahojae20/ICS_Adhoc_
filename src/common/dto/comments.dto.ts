// comments.dto.ts
import { CommentDto } from './comment.dto';
import { ICombinedInterface } from '../../../src/types/core/noticecscomment';

export class CommentsDto {
    public count: number;
    public comment: ICombinedInterface[];
    public board_id: number;
    
    constructor(count: number, board_id: number, comments: ICombinedInterface[]) {
        this.count = count;
        this.board_id = board_id;
        this.comment = comments.map(comment => {
            return new CommentDto(comment, comment.files).comment;
        });
    }
}
