import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ItemsAttributes {
    _id: number;
    marketplace?: string;
    item_no?: string;
    seller_code?: string;
    seller_name?: string;
    payload: object;
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type ItemsPk = "_id";
export type ItemsId = Items[ItemsPk];
export type ItemsOptionalAttributes = "_id" | "marketplace" | "item_no" | "seller_code" | "seller_name" | "created_at" | "updated_at" | "deleted_at";
export type ItemsCreationAttributes = Optional<ItemsAttributes, ItemsOptionalAttributes>;

export class Items extends Model<ItemsAttributes, ItemsCreationAttributes> implements ItemsAttributes {
    _id!: number;
    marketplace?: string;
    item_no?: string;
    seller_code?: string;
    seller_name?: string;
    payload!: object;
    created_at!: Date;
    updated_at?: Date;
    deleted_at?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof Items {
        return Items.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                comment: "아이템 순번"
            },
            marketplace: {
                type: DataTypes.STRING(20),
                allowNull: true,
                comment: "마켓플레이스 이름"
            },
            item_no: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "상품 고유 번호"
            },
            seller_code: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "큐텐의 판매자 상품 관리 번호"
            },
            seller_name: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: "셀러의 이름"
            },
            payload: {
                type: DataTypes.JSON,
                allowNull: false,
                comment: "상품 상세"
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
            tableName: 'items',
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
