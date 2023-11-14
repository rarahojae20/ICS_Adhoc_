import TemplateRepository from './template.repository';
import ApiCodes from '../../../lib/api.codes';
import ApiError from '../../../lib/api.error';
import ApiDetailCodes from '../../../lib/api.detail.codes';
import ApiMessages from '../../../lib/api.messages';
import { assertTrue } from '../../../lib/utils';
import { ITemplate } from '../../../types/template';

export default class TemplateService {
	public list = async () => {
		const templates = await new TemplateRepository().findAll(); //데이터베이스를 처리하는건 repository
		return templates; //템플릿을 레포지토리의 findall 값을 반환
	}

	public create = async (templateParam: ITemplate) => {
		assertTrue(Object.keys(templateParam).length > 0, new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, { //비어있는지 확인 , 첫번쨰인자가 조건(인자갯가0보다큰지) , 두번쨰인자가 false인경우 에러객체생성
			message: `Parameters cannot be empty`,
			code: ApiDetailCodes.REQ_PARAM_EMPTY,
		}));


		const template = await new TemplateRepository().getByName(templateParam.name);
		if (template) {
			throw new ApiError(ApiCodes.CONFLICT, ApiMessages.CONFLICT, {
				message: `Template name already exists`,
				code: ApiDetailCodes.TEMPLATE_NAME_DUPLICATED,
			});
		}

		const result = await new TemplateRepository().create(templateParam);
		return result;
	}

	public checkContent = (template: ITemplate, baseline: ITemplate) => {
		const replaceKeys = Object.keys(template.arguments);
		const isMatch = replaceKeys.every(key => baseline.arguments.hasOwnProperty(key));

		assertTrue(isMatch, new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
			message: `Template variable does not match`,
			code: ApiDetailCodes.EMAIL_TEMPLATE_VAR_NOT_MATCH,
		}));
	};

	public findOneById = async (id) => {
		const template = await new TemplateRepository().get(id);
		return template;
	}

	public findOneByName = async (name) => {
		const template = await new TemplateRepository().getByName(name);
		return template;
	}

}
