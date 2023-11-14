import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ExchangeAttributes {
    _id: number;
    currency_code?: string;
    nation_name?: string;
    receive_rate?: number;
    sand_rate?: number;
    sale_standard_rate?: number;
    book_value?: number;
    year_transit_interest_rate?: number;
    ten_day_transit_interest_rate?: number;
    korea_trading_standard_rate?: number;
    korea_book_value?: number;
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type ExchangePk = "_id";
export type ExchangeId = Exchange[ExchangePk];
export type ExchangeOptionalAttributes = "_id" | "currency_code" | "nation_name" | "receive_rate" | "sand_rate" | "sale_standard_rate" | "book_value" | "year_transit_interest_rate" | "ten_day_transit_interest_rate" | "korea_trading_standard_rate" | "korea_book_value" | "created_at" | "updated_at" | "deleted_at";
export type ExchangeCreationAttributes = Optional<ExchangeAttributes, ExchangeOptionalAttributes>;

export class Exchange extends Model<ExchangeAttributes, ExchangeCreationAttributes> implements ExchangeAttributes {
    _id!: number;
    currency_code?: string;
    nation_name?: string;
    receive_rate?: number;
    sand_rate?: number;
    sale_standard_rate?: number;
    book_value?: number;
    year_transit_interest_rate?: number;
    ten_day_transit_interest_rate?: number;
    korea_trading_standard_rate?: number;
    korea_book_value?: number;
    created_at!: Date;
    updated_at?: Date;
    deleted_at?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof Exchange {
        return Exchange.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            currency_code: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "통화 코드"
            },
            nation_name: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "국가\/통화명"
            },
            receive_rate: {
                type: DataTypes.DECIMAL(10,3),
                allowNull: true,
                comment: "전신환(송금) 받을때"
            },
            sand_rate: {
                type: DataTypes.DECIMAL(10,3),
                allowNull: true,
                comment: "전신환(송금) 보내실때"
            },
            sale_standard_rate: {
                type: DataTypes.DECIMAL(10,3),
                allowNull: true,
                comment: "매매 기준율"
            },
            book_value: {
                type: DataTypes.DECIMAL(10,3),
                allowNull: true,
                comment: "장부 가격"
            },
            year_transit_interest_rate: {
                type: DataTypes.DECIMAL(10,3),
                allowNull: true,
                comment: "연환가료율"
            },
            ten_day_transit_interest_rate: {
                type: DataTypes.DECIMAL(10,3),
                allowNull: true,
                comment: "10일 환가료율"
            },
            korea_trading_standard_rate: {
                type: DataTypes.DECIMAL(10,3),
                allowNull: true,
                comment: "서울외국환중개매매기준율"
            },
            korea_book_value: {
                type: DataTypes.DECIMAL(10,3),
                allowNull: true,
                comment: "서울외국환중개장부가격"
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
            }
        }, {
            sequelize,
            tableName: 'exchange',
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
