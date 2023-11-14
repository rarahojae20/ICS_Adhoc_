import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ITemplate } from '../../../types/template';
import { BaseController } from '../../../common/base/base.controller';
import { Result } from '../../../common/result';
import logger from '../../../lib/logger';
import TemplateService from './template.service';

export default class TemplateController extends BaseController{ //req res 엔드포인트에대한 요청을 처리 , http응답(실제 로직은 service에) 으로 반환
	public list = async (req: Request, res: Response) => {
		let response; //예외처리를통해 성공인지 실패인지 결정해서반환

		try {
			const result = await new TemplateService().list(); //실제 로직 처리 =templateservidce
			logger.debug('TemplateList', result);
			response = Result.ok(result).toJson(); //json형식의 	http응답으로 반환
		} catch (e: any) {
			logger.err(JSON.stringify(e));
			logger.error(e);

			response = Result.fail<Error>(e).toJson();
		}

		logger.res(httpStatus.OK, response, req);
		res.status(httpStatus.OK).json(response);
	};

	public create = async (req: Request, res: Response) => {
		let response;

		try {
			const data: ITemplate = this.extractBodyTemplate(req.body);

			const result = await new TemplateService().create(data);
			logger.debug('TemplateCreate', result); //디버그결과로그출력
			response = Result.ok(result).toJson(); //response를 json으로밚롼해서
		} catch (e: any) {
			logger.err(JSON.stringify(e));
			logger.error(e);

			response = Result.fail<Error>(e).toJson();
		}

		logger.res(httpStatus.OK, response, req);
		res.status(httpStatus.OK).json(response);
	};
}
