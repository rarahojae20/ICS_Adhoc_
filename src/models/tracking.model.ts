import * as Sequelize from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ITracking } from '../types/core/tracking';

export class Tracking extends Model<ITracking> implements ITracking {
    _id!: number;
    order_id!: number ;
    waybill_no?: string;
    local_waybill_no?: string;
    check_point?: string;
    departures?: string;
    arrivals?: string;
    courier?: string;
    nation?: string;
    status?: string;
    detail?: string;
    checked_at?: Date;
    created_at!: Date;
    updated_at?: Date;
    deleted_at?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof Tracking {
        return Tracking.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            order_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            waybill_no: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            local_waybill_no: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            check_point: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            departures: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            arrivals: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            courier: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            nation: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            status: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            detail: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            checked_at: {
                type: DataTypes.DATE,
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
            tableName: 'trackings',
            modelName: 'tracking',
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
