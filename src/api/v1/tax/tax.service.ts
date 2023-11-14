import HscodeRepository from './tax.repository';
import ApiCodes from '../../../lib/api.codes';
import ApiError from '../../../lib/api.error';
import ApiMessages from '../../../lib/api.messages';
import ApiDetailCodes from '../../../lib/api.detail.codes';
import { assertNotNull } from '../../../lib/utils';

export default class TaxService {
    public get = async(hscode) => {
        assertNotNull(hscode, new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
            code: ApiDetailCodes.REQ_PARAM_EMPTY,
            message: 'hscode is missing'
        }));

        const { count, rows:taxs } = await new HscodeRepository().get(hscode);
        return {
            count,
            taxs,
        };
    }
}
