/* eslint-disable @typescript-eslint/no-explicit-any */
import convert from 'xml-js';
import { add, parse, isValid } from 'date-fns';
import { Op } from 'sequelize';

import { env } from '../env';

import ApiCodes from './api.codes';
import ApiMessages from './api.messages';
import ApiError from './api.error';
import logger from './logger';
import time from './time';

export const getErrorResponse = (response?: any) => {
    const payload = {
        code: ApiCodes.INTERNAL_SERVER_ERROR,
        message: ApiMessages.INTERNAL_SERVER_ERROR,
        detail: {},
    };

    return { ...payload, ...response };
};

export const getSuccessResponse = (response?: any) => {
    const payload = {
        code: ApiCodes.OK,
        message: ApiMessages.OK,
        result: {},
    };

    return { ...payload, ...response };
};

export const setQoo10Params = (additionalParams: any) => {
    const commonParams = env.shopping.qoo10.commonParams;

    Object.assign(commonParams, additionalParams);
    logger.debug('axios params:', JSON.stringify(commonParams, null, 4));

    return commonParams;
};

export const setRakutenAuthKey = () => {
    const authKey = Buffer.from(`${env.shopping.rakuten.serviceSecret}:${env.shopping.rakuten.licenseKey}`, 'utf-8').toString('base64');
    return `ESA ${authKey}`;
};

export const convertXmlToJSON = (result: any) => {
    return JSON.parse(convert.xml2json(result, { compact: true }));
};

export const getOrderDate = async() => {
    const before = new Date(Date.now() - (time.DAY * 89)).toISOString().split('T');
    const now = new Date().toISOString().split('T');
    const startDay = before[0].replace(/\-/g, '');
    const endDay = now[0].replace(/\-/g, '');

    return { startDay, endDay };
};

export const generateRandomString = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; ++i) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

export const prune = (obj: any) => {
    Object.keys(obj).forEach((key) => (obj[key] === undefined || obj[key] === null) && delete obj[key]);
    return obj;
}; //undefined이나 null이면삭제
export const assertTrue = (value: boolean, error) => {
    if (value === true) return;
    if (error) throw error;
}

export const assertNotNull = (value, error) => {
    if (value) return;
    if (error) throw error;
}

export const parseIntSafe = (data: any): number => {
    if (data === undefined) return data;

    let result = data;
    try {
        result = parseInt(data, 10);
    } catch (e) {
        logger.err(JSON.stringify(e));
        logger.error(e);
    }

    return result;
};

export const isValidDateString = (dateString) => {
    return isValid(parse(dateString, 'yyyyMMdd', new Date()));
}

export const getDateRangeCondition = (from, to, attr) => {
    if (!from || !to) {
        return attr;
    }

    assertTrue(isValidDateString(from) && isValidDateString(to), new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
        message: `Invalid date format for from, to`,
        from: from,
        to: to
    }));

    const fromDate = parse(from, 'yyyyMMdd', new Date());
    const toDate = add(parse(to, 'yyyyMMdd', new Date()), { days: 1 });

    attr.created_at = {
        [Op.gte]: fromDate,
        [Op.lt]: toDate
    }

    return attr;
}
