import { Op } from "sequelize";
import { Templates } from "../../../models/templates.model";

export default class TemplateRepository {

	public async findAll() {
		return await Templates.findAll({ //templates는 sequelize 된 클래스
			attributes: ['_id', 'title', 'name', 'arguments', 'storage'],
			where: {
				deleted_at: {
					[Op.eq]: null,
				},
			},
		});
	}

	public async get(id) {
		return await Templates.findOne({
			where: {
				_id: id,
				deleted_at: {
					[Op.eq]: null,
				},
			},
		});
	}

	public async getByName(name) {
		return await Templates.findOne({
			where: {
				name,
				deleted_at: {
					[Op.eq]: null,
				},
			},
		});
	}

	public async create(templateData) {
		return await Templates.create(templateData);
	}
}
