import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface OrdersAttributes {
    _id: number;
    marketplace?: string;
    order_no?: string;
    seller_name?: string;
    payload: object;
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type OrdersPk = "_id";
export type OrdersId = Orders[OrdersPk];
export type OrdersOptionalAttributes = "_id" | "marketplace" | "order_no" | "seller_name" | "created_at" | "updated_at" | "deleted_at";
export type OrdersCreationAttributes = Optional<OrdersAttributes, OrdersOptionalAttributes>;

export class Orders extends Model<OrdersAttributes, OrdersCreationAttributes> implements OrdersAttributes {
    _id!: number;
    marketplace?: string;
    order_no?: string;
    seller_name?: string;
    payload!: object;
    created_at!: Date;
    updated_at?: Date;
    deleted_at?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof Orders {
        return Orders.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                comment: "주문 순번"
            },
            marketplace: {
                type: DataTypes.STRING(20),
                allowNull: true,
                comment: "마켓 플레이스 이름"
            },
            order_no: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "주문 고유 번호"
            },
            seller_name: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: "셀러의 이름"
            },
            payload: {
                type: DataTypes.JSON,
                allowNull: false,
                comment: "주문 상세"
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
            tableName: 'orders',
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
