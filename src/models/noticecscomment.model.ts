import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface NoticeCsCommentAttributes {
    _id: number;
    // cs_id ?: number | null;
    board_id ?: number | null;
    comment_id ?: number | null;
    type : 'notice' | 'comment' | 'cs';
    order_no ?: string | null;
    author ?: string;
    title ?: string;
    content: string | null;
    cs_type ?: string | null;
    item_type ?: string | null;
    stock_type ?: string | null;
    sku ?: string | null;
    recipient_id ?: number | null;
    shipped_at ?: Date | null;
    delivered_at ?: Date | null;
    created_at ?: Date;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}

// _id: 게시판, 댓글, CS 테이블 모두에 존재하는 순번
// order_no: 주문 번호 (CS 테이블과 게시판 테이블에 존재)
// author: 작성자 명 (게시판 및 댓글 테이블에 존재)
// content: 내용 (게시판 및 댓글 테이블에 존재)
// created_at: 입력일시 (게시판, 댓글, CS 테이블 모두에 존재)
// updated_at: 수정일시 (게시판, 댓글, CS 테이블 모두에 존재, 옵셔널)
// deleted_at: 삭제일시

export type NoticeCsCommentPk = "_id";
export type NoticeCsCommentId = NoticeCsComment[NoticeCsCommentPk];
export type NoticeCsCommentOptionalAttributes = "_id" | "board_id" | "comment_id" | "type" | "order_no" | "content" | "cs_type" | "item_type" | "stock_type" | "sku" | "recipient_id" | "shipped_at" | "delivered_at" | "created_at" | "updated_at" | "deleted_at";
export type NoticeCsCommentCreationAttributes = Optional<NoticeCsCommentAttributes, NoticeCsCommentOptionalAttributes>;

export class NoticeCsComment extends Model<NoticeCsCommentAttributes, NoticeCsCommentCreationAttributes> implements NoticeCsCommentAttributes {
    _id: number;
    // _cs_id
    board_id ?: number | null;
    comment_id ?: number | null;
    type !: 'notice' | 'comment' | 'cs';
    order_no ?: string | null;
    author ?: string;
    title ?: string;
    content: string | null;
    cs_type ?: string | null;
    item_type ?: string | null;
    stock_type ?: string | null;
    sku ?: string | null;
    recipient_id ?: number | null;
    shipped_at ?: Date | null;
    delivered_at ?: Date | null;
    created_at ?: Date;
    updated_at?: Date | null;
    deleted_at?: Date | null;
    
    static initModel(sequelize: Sequelize.Sequelize): typeof NoticeCsComment {
        return NoticeCsComment.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                comment: "순번"
            },
            // cs_id: {
            //     type: DataTypes.BIGINT,
            //     allowNull: true,
            //     comment: "CS관리 순번"
            // },
            board_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                comment: "게시판 순번"
            },
            comment_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                comment: "댓글 순번"
            },
            type: {
                type: DataTypes.ENUM('notice', 'comment', 'cs'),
                allowNull: false,
                comment: "선택"
            },
            order_no: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "주문 번호"
            },
            author: {
                type: DataTypes.STRING(30),
                allowNull: true,
                comment: "작성자 명"
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "제목/상품명"
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: "내용"
            },
            cs_type: {
                type: DataTypes.STRING(20),
                allowNull: true,
                comment: "CS 구분"
            },
            item_type: {
                type: DataTypes.STRING(20),
                allowNull: true,
                comment: "상품 구분"
            },
            stock_type: {
                type: DataTypes.STRING(20),
                allowNull: true,
                comment: "재고 구분"
            },
            sku: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "sku"
            },
            recipient_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                comment: "수취인 순번"
            },
            shipped_at: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "출고일자"
            },
            delivered_at: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "배달일자"
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'NoticeCsComment',
            timestamps: false,
            paranoid: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "_id" },
                    ]
                },
            ]
        });
    }
}
