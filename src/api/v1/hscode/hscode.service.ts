import HscodeRepository from './hscode.repository';
import TaxService from '../../../api/v1/tax/tax.service';
import { PaginationVo } from '../../../common/vo/pagination.vo';

export default class HscodedService {
    public list = async(param: PaginationVo) => {
        const { count, rows: hscodes } = await new HscodeRepository().list(param);

        return {
            count,
            hscodes,
        };
    }

    public search = async(param: PaginationVo, q) => {
        const { count, rows: hscodes } = await new HscodeRepository().search(param, q);

        return {
            count,
            hscodes,
        };
    }

    public getTaxs = async(hscode) => {
        const result = await new TaxService().get(hscode);
        return result;
    }

    public updateKeyword = async(hscode, keywords) => {
        await new HscodeRepository().updateKeyword(hscode, keywords);
        return { hscode };
    }
}
