import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

/**
 * HSCODE_DB
 * - id
 * - hscode // HS코드
 * - section_code // 부코드
 * - section_kr // 부 한글명
 * - chapter_kr // 류 한글명
 * - heading_kr // 호 한글명
 * - section_en // 부 영문명
 * - chapter_en // 류 영문명
 * - heading_en // 호 영문명
 * - item_name_kr // 한글 품목명
 * - item_name_en // 영문 품목명
 * - created_at
 * - updated_at
 * - deleted_at
 */

export interface HscodesAttributes {
    _id: number;
    hscode: string;
    section_code: string;
    section_kr: string;
    chapter_kr: string;
    heading_kr: string;
    section_en: string;
    chapter_en: string;
    heading_en: string;
    item_name_kr: string;
    item_name_en: string;
    keyword?: JSON;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type HscodesPk = "_id";
export type HscodesId = Hscodes[HscodesPk];
export type HscodesOptionalAttributes = "_id" | "hscode" | "section_code" | "section_kr" | "chapter_kr" | "heading_kr" | "section_en" | "chapter_en" | "heading_en" | "item_name_kr" | "item_name_en" | "keyword" | "created_at" | "updated_at" | "deleted_at";
export type HscodesCreationAttributes = Optional<HscodesAttributes, HscodesOptionalAttributes>;

export class Hscodes extends Model<HscodesAttributes, HscodesCreationAttributes> implements HscodesAttributes {
    _id!: number;
    hscode!: string;
    section_code!: string;
    section_kr!: string;
    chapter_kr!: string;
    heading_kr!: string;
    section_en!: string;
    chapter_en!: string;
    heading_en!: string;
    item_name_kr!: string;
    item_name_en!: string;
    keyword?: JSON;
    created_at!: Date;
    updated_at?: Date;
    deleted_at?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof Hscodes {
        return Hscodes.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            hscode: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: "HS코드"
            },
            section_code: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "부코드"
            },
            section_kr: {
                type: DataTypes.STRING(1024),
                allowNull: true,
                comment: "부 한글명"
            },
            chapter_kr: {
                type: DataTypes.STRING(1024),
                allowNull: true,
                comment: "류 한글명"
            },
            heading_kr: {
                type: DataTypes.STRING(1024),
                allowNull: true,
                comment: "호 한글명"
            },
            section_en: {
                type: DataTypes.STRING(1024),
                allowNull: true,
                comment: "부 영문명"
            },
            chapter_en: {
                type: DataTypes.STRING(1024),
                allowNull: true,
                comment: "류 영문명"
            },
            heading_en: {
                type: DataTypes.STRING(1024),
                allowNull: true,
                comment: "호 영문명"
            },
            item_name_kr: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: "한글 품목명"
            },
            item_name_en: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: "영문 품목명"
            },
            keyword: {
                type: DataTypes.JSON,
                allowNull: true
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false
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
            tableName: 'hscodes',
            timestamps: false,
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

export default Hscodes;
