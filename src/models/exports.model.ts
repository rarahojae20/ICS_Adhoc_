import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ExportsAttributes {
    _id: number;
    order_no?: string;
    invoice_no?: string;
    agente_no?: string;
    com_id?: string;
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type ExportsPk = "_id";
export type ExportsId = Exports[ExportsPk];
export type ExportsOptionalAttributes = "_id" | "order_no" | "invoice_no" | "agente_no" | "com_id" | "created_at" | "updated_at" | "deleted_at";
export type ExportsCreationAttributes = Optional<ExportsAttributes, ExportsOptionalAttributes>;

export class Exports extends Model<ExportsAttributes, ExportsCreationAttributes> implements ExportsAttributes {
    _id!: number;
    order_no?: string;
    invoice_no?: string;
    agente_no?: string;
    com_id?: string;
    created_at!: Date;
    updated_at?: Date;
    deleted_at?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof Exports {
        return Exports.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            order_no: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "주문 번호"
            },
            invoice_no: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "송장 번호"
            },
            agente_no: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "Agente 고유번호"
            },
            com_id: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "회사 아이디"
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
            tableName: 'exports',
            timestamps: false,
            indexes: [
                {
                    name: "exports_pkey",
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
