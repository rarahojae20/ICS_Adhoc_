import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

/**
 * 메일 디비
 * - id
 * - to // 수신자 이메일 주소
 * - status // 발송완료, 발송실패
 * - message_id // ses message id
 * - reason // 발송실패시 실패사유
 * - sent_at // 발송시간
 * - created_at
 * - updated_at
 * - deleted_at
 */

export interface EmailsAttributes {
    _id: number;
    to: string;
    status?: string;
    message_id?: string;
    reason?: string;
    sent_at?: Date;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type EmailsPk = "_id";
export type EmailsId = Emails[EmailsPk];
export type EmailsOptionalAttributes = "_id" | "status" | "message_id" | "reason" | "sent_at" | "created_at" | "updated_at" | "deleted_at";
export type EmailsCreationAttributes = Optional<EmailsAttributes, EmailsOptionalAttributes>;

export class Emails extends Model<EmailsAttributes, EmailsCreationAttributes> implements EmailsAttributes {
    _id!: number;
    to!: string;
    status!: string;
    message_id!: string;
    reason?: string;
    sent_at?: Date;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof Emails {
        return Emails.init({
        _id: {
            autoIncrement: true,
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        to: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        message_id: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        reason: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        sent_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
        }, {
        sequelize,
        tableName: 'emails',
        timestamps: false,
        indexes: [
            {
                name: "emails_pkey",
                unique: true,
                fields: [
                    { name: "_id" },
                ]
            },
        ]
        });
    }
}
