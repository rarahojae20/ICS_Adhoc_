import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface FileAttributes {
    _id: number;
    board_id?: number;
    comment_id?: number;
    storage: object;
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type FilePk = "_id";
export type FileId = File[FilePk];
export type FileOptionalAttributes = "_id" | "board_id" | "comment_id" | "created_at" | "updated_at" | "deleted_at";
export type FileCreationAttributes = Optional<FileAttributes, FileOptionalAttributes>;

export class File extends Model<FileAttributes, FileCreationAttributes> implements FileAttributes {
    _id!: number;
    board_id?: number;
    comment_id?: number;
    storage!: object;
    created_at!: Date;
    updated_at?: Date;
    deleted_at?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof File {
        return File.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                comment: "파일 순번"
            },
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
            storage: {
                type: DataTypes.JSON,
                allowNull: false,
                comment: "파일 저장된 경로"
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
            tableName: 'file',
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
