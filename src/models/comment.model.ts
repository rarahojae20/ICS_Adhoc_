import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface CommentAttributes {
    _id: number;
    board_id: number;
    author: string;
    content: string;
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type CommentPk = "_id";
export type CommentId = Comment[CommentPk];
export type CommentOptionalAttributes = "_id" | "created_at" | "updated_at" | "deleted_at";
export type CommentCreationAttributes = Optional<CommentAttributes, CommentOptionalAttributes>;

export class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
    _id!: number;
    board_id!: number;
    author!: string;
    content!: string;
    created_at!: Date;
    updated_at?: Date;
    deleted_at?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof Comment {
        return Comment.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                comment: "댓글 순번"
            },
            board_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                comment: "게시판 순번"
            },
            author: {
                type: DataTypes.STRING(30),
                allowNull: false,
                comment: "작성자 명"
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
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
            tableName: 'comment',
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
