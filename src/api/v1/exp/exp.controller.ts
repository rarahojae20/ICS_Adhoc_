import httpStatus from 'http-status';
import { Result } from '../../../common/result';
import logger from '../../../lib/logger';
import ExportService from './exp.service';
import { PaginationVo } from '../../../common/vo/pagination.vo';

export default class ExportController {
    public checkExports = async (req, res) => {
        const invoiceNo = req.query.invoiceNo;
        const invoiceList = typeof(invoiceNo) === 'string' ? [invoiceNo] : invoiceNo;
        // '' 또는 undefined가 포함된 배열을 필터링
        const filteredInvoiceList = invoiceList?.filter((invoice) => invoice !== '' && invoice !== undefined);
        const page = req.query?.page ? parseInt(req.query.page, 10) : 1;
        const size = req.query?.size ? parseInt(req.query?.size, 10) : 15;
        let response;

        try {
            const result = await new ExportService().checkExports(filteredInvoiceList, new PaginationVo(Number(page), Number(size)));
            logger.debug('checkExports result:', result);

            response = Result.ok(result).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

    public registerExports = async (req, res) => {
        const data = req.body;
        let response;

        try {
            const result = await new ExportService().registerExports(data);
            logger.debug('registerExports result:', result);
            response = Result.ok(result).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

    public checkSimplifiedExports = async (req, res) => {
        const orderNo = req.query.orderNo;
        const orderList = typeof(orderNo) === 'string' ? [orderNo] : orderNo;
        // '' 또는 undefined가 포함된 배열을 필터링
        const filteredOrderList = orderList?.filter((order) => order !== '' && order !== undefined);
        const page = req.query?.page ? parseInt(req.query.page, 10) : 1;
        const size = req.query?.size ? parseInt(req.query?.size, 10) : 15;
        let response;

        try {
            const result = await new ExportService().checkSimplifiedExports(filteredOrderList, new PaginationVo(Number(page), Number(size)));
            logger.debug('checkSimplifiedExports result:', result);

            response = Result.ok(result).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

    public registerSimplifiedExports = async (req, res) => {
        const data = req.body;
        let response;

        try {
            const result = await new ExportService().registerSimplifiedExports(data);
            logger.debug('registerSimplifiedExports result:', result);
            response = Result.ok(result).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

}
