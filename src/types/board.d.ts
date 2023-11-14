import { IFile } from './file';
import { ICustomerService } from './cs';

export interface IBoard {
    type : 'board' | 'comment' | 'cs';


    order_no?: string;
    author ?: string;
    title ?: string;
    content?: string;

    files?: IFile[];

    seq? :number; // 프론트에서 요청한 정렬 순번
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
//page, size, type, from, to, order_no, title, author



// _id: number;
// cs_id ?: number | null;
// board_id ?: number | null;
// comment_id ?: number | null;
// type : 'board' | 'comment' | 'cs';
// order_no ?: string | null;
// author ?: string;
// title ?: string;
// content: string | null;
// cs_type ?: string | null;
// item_type ?: string | null;
// stock_type ?: string | null;
// sku ?: string | null;
// recipient_id ?: number | null;
// shipped_at ?: Date | null;
// delivered_at ?: Date | null;
// created_at ?: Date;
// updated_at?: Date | null;
// deleted_at?: Date | null;
