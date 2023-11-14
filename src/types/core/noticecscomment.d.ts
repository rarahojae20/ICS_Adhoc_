import { CommentDto } from "../../../src/common/dto/comment.dto";
import { CommentsDto } from "../../../src/common/dto/comments.dto";
import { IFile } from "../file";

export interface ICombinedInterface {
  getDataValue(arg0: string);
  type: 'notice' | 'comment' | 'cs' ;
  _id?: number;
  board_id?: number;
  comment_id?: number;
  order_no?: string;
  author?: string;
  title?: string;
  content?: string;

  files?: IFile[];
  seq?: number; // 프론트에서 요청한 정렬 순번

   
  cs_type?: string;
  item_type?: string;  
  stock_type?: string;  
  sku?: string;  

  recipient_id?: number;  
  shipped_at?: Date;  
  delivered_at?: Date;  

  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;

  comments?: CommentsDto;

  
}    
