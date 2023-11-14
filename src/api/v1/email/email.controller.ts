import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IEmail } from '../../../types/email';
import { Result } from '../../../common/result';
import logger from '../../../lib/logger';
import EmailService from './email.service';

export default class EmailController {
    public getEmails = async (req, res) => {
        let response;
        const { status, to, message_id } = req.query;
        let sqlQuery:any = {};
        const isRoot = req.user?.roles.some(role => role.name === 'root');

        try {
            if (!isRoot) {
                const parsedMessageId = message_id ? Buffer.from(message_id, 'base64').toString('ascii') : '';
                sqlQuery.message_id = parsedMessageId;
            }

            sqlQuery = {
                ...sqlQuery,
                status,
                to,
            };

            let result = await new EmailService().getEmails(sqlQuery);

            if (!isRoot && result.length > 0) {
                delete result[0]?.to;
                result[0].message_id = message_id;
            }

            logger.debug('getEmails result:', result);
            response = Result.ok<IEmail[]>(result).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

    public sendEmail = async (req: Request, res: Response) => {
        let response;
        const { to, title, template } = req.body;

        const mailOptions = {
            to,
            title,
            template: {
                arguments: template?.arguments,
                id: template?.id || template?.number, // 하위호환성 유지를 위한 number
                name: template?.name
            }
        };

        try {
            const result = await new EmailService().sendEmail(mailOptions);
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
