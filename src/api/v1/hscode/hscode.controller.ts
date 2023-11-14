import httpStatus from 'http-status';
import { Result } from '../../../common/result';
import { PaginationVo } from '../../../common/vo/pagination.vo';
import logger from '../../../lib/logger';
import HscodeService from './hscode.service';

export default class HscodeController {
    public list = async (req, res) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const q = req.query?.q;
        const page = req.query?.page ? parseInt(req.query.page, 10) : 1;
        const size = req.query?.size ? parseInt(req.query?.size, 10) : 15;
        let response;
        let result;

        try {
            if (q === undefined) {
                result = await new HscodeService().list(new PaginationVo(Number(page), Number(size)));
            } else {
                result = await new HscodeService().search(new PaginationVo(Number(page), Number(size)), q);
            }

            response = Result.ok<JSON>(result).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

    public getTaxs = async (req, res) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { hscode } = req.params;
        let result;
        let response;

        try {
            result = await new HscodeService().getTaxs(hscode);
            response = Result.ok<JSON>(result).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

    public updateKeyword = async (req, res) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { hscode } = req.params;
        const { keywords } = req.body;
        let result;
        let response;

        try {
            result = await new HscodeService().updateKeyword(hscode, keywords);
            response = Result.ok<JSON>(result).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };
}
