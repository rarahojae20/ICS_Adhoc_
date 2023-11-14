/* eslint-disable @typescript-eslint/no-explicit-any */
// import { supportLanguages } from '../../../app';

import ApiError from '../../../lib/api.error';
import ApiCodes from '../../../lib/api.codes';
import ApiDetailCodes from '../../../lib/api.detail.codes';
import ApiMessages from '../../../lib/api.messages';

// import Google from '../../../lib/google';

export default class TranslateService {
    translate = async(content: string, targetLanguageCode: string): Promise<string> => {
        if (content.length <= 0) return content;

        await this.checkSupportedLanguages(targetLanguageCode);
        const translateText = await this.translateText(
            [ content ], // 규격상 번역해야하는 문자열을 배열로 받아오도록 되어 있음.
            targetLanguageCode
        );

        return translateText[0];
    };

    translateText = async(contents: string[], targetLanguageCode: string): Promise<string[]> => {
        let result: string[];

        try {
            // result = await new Google().translateText(
                contents,
                targetLanguageCode
            );
        } catch (e: any) {
            throw new ApiError(ApiCodes.BAD_REQUEST, e.message);
        }

        return result;
    };

    checkSupportedLanguages = async(targetLanguageCode: string): Promise<void> => {
        const checkLanguages = (await supportLanguages).filter((item) => {
            return item === targetLanguageCode;
        });

        if (checkLanguages.length <= 0) {
            throw new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
                code: ApiDetailCodes.REQ_PARAM_SUPPORT_LANGUAGES_WRONG,
                message: 'targetLanguageCode is not support language'
            });
        }
    };
}
