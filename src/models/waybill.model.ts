import * as Sequelize from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { IWaybill } from "../types/core/waybill";

export class Waybill extends Model<IWaybill> implements IWaybill {
    _id!: number;
    waybill_no?: string;
    courier?: string;

    created_at!: Date;
    updated_at?: Date;
    deleted_at?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof Waybill {
        Waybill.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            waybill_no: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            courier: {
                type: DataTypes.STRING(100),
                allowNull: true
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
            tableName: 'waybills',
            modelName: 'waybill',
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

        return Waybill;
    }
}
