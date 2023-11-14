import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

/**
 * TAX_DB
 * - id
 * - hscode_id // HS코드 외래키
 * - tariff_rate // 관세율
 * - tariff_type // 관세율 구분
 * - effective_date // 적용개시일
 * - expiration_date // 적용만료일
 * - using_tax_rates_type // 용도세율구분
 * - per_unit_tax // 단위당 세액
 * - base_price // 기준가격
 * - create_at
 * - update_at
 * - deleted_at
 */
export interface TaxsAttributes {
    _id: number;
    hscode: string;
    tariff_rate: number;
    tariff_type: string;
    effective_date: Date;
    expiration_date: Date;
    using_tax_rates_type: string;
    per_unit_tax: number;
    base_price: number;
    create_at?: Date;
    update_at?: Date;
    deleted_at?: Date;
}

export type TaxsPk = "_id";
export type TaxsId = Taxs[TaxsPk];
export type TaxsOptionalAttributes = "_id" | "hscode" | "tariff_rate" | "tariff_type" | "effective_date" | "expiration_date" | "using_tax_rates_type" | "per_unit_tax" | "base_price" | "create_at" | "update_at" | "deleted_at";
export type TaxsCreationAttributes = Optional<TaxsAttributes, TaxsOptionalAttributes>;

export class Taxs extends Model<TaxsAttributes, TaxsCreationAttributes> implements TaxsAttributes {
    _id!: number;
    hscode!: string;
    tariff_rate!: number;
    tariff_type!: string;
    effective_date!: Date;
    expiration_date!: Date;
    using_tax_rates_type!: string;
    per_unit_tax!: number;
    base_price!: number;
    create_at?: Date;
    update_at?: Date;
    deleted_at?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof Taxs {
        return Taxs.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            hscode: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            tariff_rate: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false
            },
            tariff_type: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            effective_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            expiration_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            using_tax_rates_type: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            per_unit_tax: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: true
            },
            base_price: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: true
            },
            create_at: {
                type: DataTypes.DATE,
                allowNull: true
            },
            update_at: {
                type: DataTypes.DATE,
                allowNull: true
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'taxs',
            timestamps: false,
            indexes: [{
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "_id" },
                ]
            }]
        });
    }
}
