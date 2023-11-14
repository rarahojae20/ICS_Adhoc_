import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

/**
 * 템플릿 디비
 * - _id
 * - title // 이메일 제목
 * - name // 템플릿 이름
 * - arguments // 치환할 템플릿 내 변수
 * - storage // 템플릿 저장된 경로
 * - created_at
 * - updated_at
 * - deleted_at
 */

export interface TemplatesAttributes {
	_id: number;
	title: string;
	name: string;
	arguments: object;
	storage: object;
	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date;
}

export type TemplatesPk = "_id";
export type TemplatesId = Templates[TemplatesPk];
export type TemplatesOptionalAttributes = "_id" | "created_at" | "updated_at" | "deleted_at";
export type TemplatesCreationAttributes = Optional<TemplatesAttributes, TemplatesOptionalAttributes>;

export class Templates extends Model<TemplatesAttributes, TemplatesCreationAttributes> implements TemplatesAttributes {
	_id!: number;
	title!: string;
	name!: string;
	arguments!: object;
	storage!: object;
	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date;

	static initModel(sequelize: Sequelize.Sequelize): typeof Templates {
		return Templates.init({
			_id: {
				autoIncrement: true,
				type: DataTypes.BIGINT,
				allowNull: false,
				primaryKey: true
			},
			title: {
				type: DataTypes.STRING(100),
				allowNull: false
			},
			name: {
				type: DataTypes.STRING(100),
				allowNull: false
			},
			arguments: {
				type: DataTypes.JSON,
				allowNull: false
			},
			storage: {
				type: DataTypes.JSON,
				allowNull: false
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: true,
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
			tableName: 'templates',
			timestamps: false,
			indexes: [
				{
					name: "templates_pkey",
					unique: true,
					fields: [
						{ name: "_id" },
					]
				},
			]
		});
	}
}
