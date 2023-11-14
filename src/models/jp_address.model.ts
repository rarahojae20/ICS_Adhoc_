import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface JP_AddressAttributes {
    _id: number;
    postal_code?: string;
    prefecture?: string;
    municipality?: string;
    town_area?: string;
    romanization?: string;
    prefecture_hi?: string;
    municipality_hi?: string;
    town_area_hi?: string;
    office_code?: number;
    area_code?: number;
    agency?: string;
    added_at?: Date;
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type JP_AddressPk = "_id";
export type JP_AddressId = JP_Address[JP_AddressPk];
export type JP_AddressCreationAttributes = Optional<JP_AddressAttributes, JP_AddressPk>;
export type JP_AddressOptionalAttributes = "_id" | "created_at" | "updated_at" | "deleted_at";

export class JP_Address extends Model<JP_AddressAttributes, JP_AddressCreationAttributes> implements JP_AddressAttributes {
    _id!: number;
    postal_code?: string;
    prefecture?: string;
    municipality?: string;
    town_area?: string;
    romanization?: string;
    prefecture_hi?: string;
    municipality_hi?: string;
    town_area_hi?: string;
    office_code?: number;
    area_code?: number;
    agency?: string;
    added_at?: Date;
    created_at!: Date;
    updated_at?: Date;
    deleted_at?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof JP_Address {
        return JP_Address.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                comment: "주소 순번"
            },
            postal_code: {
                type: DataTypes.STRING(20),
                allowNull: true,
                comment: "우편 번호"
            },
            prefecture: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "도"
            },
            municipality: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "시"
            },
            town_area: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "구"
            },
            romanization: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: "로마자"
            },
            prefecture_hi: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "도(히라가나)"
            },
            municipality_hi: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "시(히라가나)"
            },
            town_area_hi: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "구(히라가나)"
            },
            office_code: {
                type: DataTypes.BIGINT,
                allowNull: true,
                comment: "사무소 코드"
            },
            area_code: {
                type: DataTypes.BIGINT,
                allowNull: true,
                comment: "지역 코드"
            },
            agency: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "배송사"
            },
            added_at: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "데이터가 마스터팩에 추가된 날짜"
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
            tableName: 'jp_address',
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
