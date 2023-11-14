import { describe, it, before } from 'mocha';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import cache from 'memory-cache';

import { app } from '../../src/app';
import { env } from '../../src/env';

import logger from '../../src/lib/logger';
import ApiCodes from '../../src/lib/api.codes';
import ApiMessages from '../../src/lib/api.messages';
import ApiDetailCodes from '../../src/lib/api.detail.codes';
import WaybillService from "../../src/api/v1/waybills/waybill.service";

chai.use(chaiSubset);
chai.use(chaiLike);
chai.use(chaiThings);

const expect = chai.expect;

const responseSuccessKeys = ['code', 'message', 'result'];
const responseFailKeys = ['code', 'message', 'detail'];

describe(`/v1/waybill Test`, async() => {
    before(async() => {
        try {
            logger.init({
                console: false,
                debug: true,
                log: true,
                error: true,
                info: true,
                fatal: true,
                sql: true,
                net: true,
            });
            logger.log(`[ ${env.mode.value} ] =========================================`);
        } catch (e) {
            console.log(e);
        }
    });

    describe(`송장번호 추가`, () => {

        it(`회사명, 송장번호 전송`, async() => {
            const waybillNo = faker.random.numeric(12);
            const courier = 'testCarrier';
            const res = await request(app)
                .post('/v1/waybills')
                .set('Accept', 'application/json')
                .send({
                    waybill_no: waybillNo,
                    courier: courier,
                });

            console.log(res.body);
            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result.waybill.waybill_no).to.equal(waybillNo);
            expect(res.body.result.waybill.courier).to.equal(courier);
            cache.put('waybillNo', res.body.result.waybill.waybill_no);
            cache.put('waybillModel', res.body.result.waybill);
        });

        it(`중복 송장 등록 시`, async() => {
            const waybillNo = cache.get('waybillNo');
            const courier = 'testCarrier';
            const res = await request(app)
                .post('/v1/waybills')
                .set('Accept', 'application/json')
                .send({
                    waybill_no: waybillNo,
                    courier: courier,
                });
            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
            expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
            expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_INVALID);
        });

        after(async () => {
            const target = cache.get('waybillModel');
            await new WaybillService().delete(target);
        });
    });

});
