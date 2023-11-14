import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface BoardAttributes {
    _id: number;
    cs_id?: number;
    order_no?: string;
    author: string;
    title: string;
    content?: string;
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type BoardPk = "_id";
export type BoardId = Board[BoardPk];
export type BoardOptionalAttributes = "_id" | "order_no" | "cs_id" | "content" | "created_at" | "updated_at" | "deleted_at";
export type BoardCreationAttributes = Optional<BoardAttributes, BoardOptionalAttributes>;

export class Board extends Model<BoardAttributes, BoardCreationAttributes> implements BoardAttributes {
    _id!: number;
    cs_id?: number;
    order_no?: string;
    author!: string;
    title!: string;
    content?: string;
    created_at!: Date;
    updated_at?: Date;
    deleted_at?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof Board {
        return Board.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                comment: "게시판 순번"
            },
            cs_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                comment: "CS관리 순번"
            },
            order_no: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "주문 번호"
            },
            author: {
                type: DataTypes.STRING(30),
                allowNull: false,
                comment: "작성자 명"
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: false,
                comment: "제목\/상품명"
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: "내용"
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
            tableName: 'board',
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
