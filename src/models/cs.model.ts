import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface CSAttributes {
    _id: number;
    order_no?: string;
    cs_type?: string;
    item_type?: string;
    stock_type?: string;
    sku?: string;
    recipient_id?: number;
    shipped_at?: Date;
    delivered_at?: Date;
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type CSPk = "_id";
export type CSId = CS[CSPk];
export type CSOptionalAttributes = "_id" | "order_no" | "cs_type" | "item_type" | "stock_type" | "sku" | "recipient_id" | "shipped_at" | "delivered_at" | "created_at" | "updated_at" | "deleted_at";
export type CSCreationAttributes = Optional<CSAttributes, CSOptionalAttributes>;

export class CS extends Model<CSAttributes, CSCreationAttributes> implements CSAttributes {
    _id!: number;
    order_no?: string;
    cs_type?: string;
    item_type?: string;
    stock_type?: string;
    sku?: string;
    recipient_id?: number;
    shipped_at?: Date;
    delivered_at?: Date;
    created_at!: Date;
    updated_at?: Date;
    deleted_at?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof CS {
        return CS.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                comment: "CS관리 순번"
            },
            order_no: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "주문 번호"
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
            tableName: 'cs',
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
