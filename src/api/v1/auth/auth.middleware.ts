import logger from '../../../lib/logger';
import httpStatus from 'http-status';
import { env } from '../../../env';
import { Builder } from "builder-pattern";
import { IAxios } from "../../../types/axios";
import Axios from "../../../lib/axios";
import ApiCodes from "../../../lib/api.codes";
import ApiMessages from "../../../lib/api.messages";
import {Result} from "../../../common/result";

export default class AuthMiddleware {

    public getAccessToken = async(req, res) => {

        const authorizationHeader = req.headers?.authorization;
        let accessToken;
        if (authorizationHeader) {
            logger.log(`authorizationHeader : ${authorizationHeader}`);
            accessToken = authorizationHeader.split(' ')[1];
            logger.log(`accessToken : ${accessToken}`);
        }

        return accessToken;
    }// getAccessToken

    public verifyUserAuth = async(req, res, next) => {
        try {
            const accessToken = await this.getAccessToken(req, res);
            const config = Builder<IAxios>()
                .method('get')
                .url(`${env.app.web.url}/v1/auth/verify`)
                .headers({
                    'Authorization': `Bearer ${accessToken}`,
                })
                .build();

            const response = await Axios.setConfig(config).send();
            const resCode = response.body.code;
            const resMessage = response.body.message;
            const unAuthCodes = [ApiCodes.TOKEN_EXPIRED, ApiCodes.TOKEN_INVALID, ApiCodes.UNAUTHORIZED, ApiCodes.FORBIDDEN];
            const unAuthMessages = [ApiMessages.TOKEN_EXPIRED, ApiMessages.TOKEN_INVALID, ApiMessages.UNAUTHORIZED, ApiMessages.FORBIDDEN];

            if (unAuthCodes.includes(resCode) && unAuthMessages.includes(resMessage)) {
                logger.res(httpStatus.OK, response, req);
                res.status(httpStatus.OK).json(response);
                return;
            }
            next();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            const result = Result.fail(e).toJson();
            res.status(httpStatus.OK).json(result);
        }
    }// verifyUserAuth
}
