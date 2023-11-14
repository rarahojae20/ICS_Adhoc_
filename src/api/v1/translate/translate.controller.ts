/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import ApiError from '../../../lib/api.error';
import ApiCodes from '../../../lib/api.codes';
import ApiDetailCodes from '../../../lib/api.detail.codes';
import ApiMessages from '../../../lib/api.messages';
import logger from '../../../lib/logger';

import { Result } from '../../../common/result';

import TranslateService from './translate.service';

export default class TranslateController {
    translate = async(req: Request, res: Response) => {
        const { content } = req.body;
        let { targetLanguageCode } = req.body;
        let result;

        try {
            if (typeof content === 'undefined') {
                throw new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
                    code: ApiDetailCodes.REQ_PARAM_EMPTY,
                    message: 'content is wrong'
                });
            }

            // eslint-disable-next-line no-extra-boolean-cast
            if (!!!targetLanguageCode) {
                targetLanguageCode = 'en';
            }

            const translateText = await new TranslateService().translate(content, targetLanguageCode);

            result = Result.ok<string>(translateText).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);
            result = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, result, req);
        res.status(httpStatus.OK).json(result);
    };
}
