import { describe, it, before } from 'mocha';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
import request from 'supertest';
import cache from 'memory-cache';
import { faker } from '@faker-js/faker';

import { app } from '../../src/app';
import { env } from '../../src/env';

import logger from '../../src/lib/logger';
import ApiCodes from '../../src/lib/api.codes';
import ApiMessages from '../../src/lib/api.messages';

chai.use(chaiSubset);
chai.use(chaiLike);
chai.use(chaiThings);

const expect = chai.expect;

const responseSuccessKeys = ['code', 'message', 'result'];

describe(`/v1/hscode API Test`, async() => {
    before(async () => {
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

    describe(`hscode 조회 성공 테스트`, () => {
        it (`hscode 목록 조회`, async() => {
            const res = await request(app)
                .get('/v1/hscodes')
                .set('Accept', 'application/json')
                .query({});

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
            expect(res.body.result.hscodes.length).to.equal(15);
        });

        it (`size, page를 설정한 hscode 목록 조회`, async() => {
            const res = await request(app)
                .get('/v1/hscodes')
                .set('Accept', 'application/json')
                .query({
                    size: 10,
                    page: 2,
                });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
            expect(res.body.result.hscodes.length).to.equal(10);
        });
    });

    describe(`hscode 검색 테스트`, () => {
        it (`hscode를 통한 검색`, async() => {
            const res = await request(app)
                .get('/v1/hscodes')
                .set('Accept', 'application/json')
                .query({
                    q: 8510100000
                });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
            expect(res.body.result.count).to.equal(1);
        });

        it (`keyword 검색을 위한 keyword 설정`, async() => {
            const res = await request(app)
                .put('/v1/hscodes/8510100000/keywords')
                .set('Accept', 'application/json')
                .send({
                    keywords: ['테스트', '키워드']
                });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
        });

        it (`keyword 검색`, async() => {
            const res = await request(app)
                .get('/v1/hscodes')
                .set('Accept', 'application/json')
                .query({
                    q: '테스트'
                });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
            expect(res.body.result.hscodes[0].hscode).to.equal('8510100000');
        });

        it (`keyword 초기화`, async() => {
            const res = await request(app)
                .put('/v1/hscodes/8510100000/keywords')
                .set('Accept', 'application/json')
                .send({
                    keywords: null
                });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
        });
    });

});
