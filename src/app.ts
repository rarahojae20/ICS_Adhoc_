import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import { isMasterProcess } from 'pm2-master-process'

import { env } from './env'; //env.ts
import { version } from '../package.json';

import logger from './lib/logger';
import * as mysql from './lib/mysql';
import * as requestIp from 'request-ip';
import tracer from 'cls-rtracer';
// import Google from './lib/google';

import Scheduler from './scheduler/scheduler';

import * as Api from './app.router';

export const app = express();
// export const supportLanguages = new Google().getSupportedLanguages();
function getOrigins() {
    const origins = env.app.cors.origins?.split(',') || [];
    logger.log('origins:', JSON.stringify(origins));
    return origins;
}

// https://1004lucifer.blogspot.com/2019/04/axios-response-headers-content.html
app.use(
    cors({
        origin: getOrigins(),
        exposedHeaders: ['Content-Disposition'],
        credentials: true,
    })
);

// 로거는 idp 이용
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(requestIp.mw());
app.use(tracer.expressMiddleware());
app.use(Api.path, Api.router);

app.listen(env.app.port, async function appMain() {
    logger.init({
        log: true,
        sql: true,
        mongo: true,
        net: true,
        debug: !env.mode.prod,
        error: true,
        fatal: true,
        console: false,
    });

    await mysql.connect();
    // 상용모드나 개발모드인 경우 멀티 프로세스로 동작할때 스케줄러를 실행한다.
    if (env.mode.value === 'prod' || env.mode.value === 'dev') {
        if (await isMasterProcess()) await new Scheduler().startJob();
    }

    logger.log(`[ v${version}, ${env.mode.value} ] =========================================`);

    logger.log(`----------------------------------------------`);
    logger.log(`🚀 App listening on the port ${env.app.port}`);
    logger.log(`==============================================`);

    console.log(`${new Date().toISOString()} [ v${version}, ${env.mode.value} ] =================================== READY !!!`);
});
