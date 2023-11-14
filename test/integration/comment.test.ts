import { describe, it, before } from 'mocha';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import path from 'path';
// import cache from 'memory-cache';

import { app } from '../../src/app';
import { env } from '../../src/env';

import logger from '../../src/lib/logger';
import ApiCodes from '../../src/lib/api.codes';
import ApiMessages from '../../src/lib/api.messages';
import ApiDetailCodes from '../../src/lib/api.detail.codes';

chai.use(chaiSubset);
chai.use(chaiLike);
chai.use(chaiThings);

const expect = chai.expect;

const responseSuccessKeys = ['code', 'message', 'result'];
const responseFailKeys = ['code', 'message', 'detail'];

describe(`/v1/comments API Test`, async() => {
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

    describe(`댓글 생성`, () => {
        it (`정상 동작 시 (파일 포함)`, async() => {
            const res = await request(app)
                .post('/v1/comments')
                .set('Accept', 'application/json')
                .set('Content-type', 'multipart/form-data')
                .field('boardId', 1) // 임의로 1로 고정
                .field('author', faker.random.words(1))
                .field('content', faker.random.words(50))
                .attach('images', path.resolve(__dirname, '../assets/mongu.jpg'))
                .attach('images', path.resolve(__dirname, '../assets/mongu.jpg'))
                .attach('images', path.resolve(__dirname, '../assets/mongu.jpg'));

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
        });

        it (`정상 동작 시 (파일 미 포함)`, async() => {
            const res = await request(app)
                .post('/v1/comments')
                .set('Accept', 'application/json')
                .set('Content-type', 'multipart/form-data')
                .field('boardId', 1) // 임의로 1로 고정
                .field('author', faker.random.words(1))
                .field('content', faker.random.words(50));

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
        });

        it (`파라미터의 값이 없을 경우`, async() => {
            const res = await request(app)
                .post('/v1/comments')
                .set('Accept', 'application/json')
                .set('Content-type', 'multipart/form-data')
                .field('boardId', '') // 임의로 1로 고정
                .field('author', '')
                .field('content', '');

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
            expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
            expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_EMPTY);
        });
    });

    describe(`공지사항 조회`, () => {
        it (`정상 동작 시 (page, size가 없을 경우)`, async() => {
            const res = await request(app)
                .get('/v1/comments')
                .set('Accept', 'application/json')
                .query({
                    boardId: 1
                });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
            expect(res.body.result.count).to.be.a('number');
            expect(res.body.result.comment).to.be.a('array');
        });

        it (`정상 동작 시 (page, size가 있을 경우)`, async() => {
            const res = await request(app)
                .get('/v1/comments')
                .set('Accept', 'application/json')
                .query({
                    page: 1,
                    size: 20,
                    boardId: 1
                });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
            expect(res.body.result.count).to.be.a('number');
            expect(res.body.result.comment).to.be.a('array');
        });

        it (`page, size가 문자인 경우`, async() => {
            const res = await request(app)
                .get('/v1/comments')
                .set('Accept', 'application/json')
                .query({
                    page: 'a',
                    size: 'b',
                    boardId: 1
                });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
            expect(res.body.result.count).to.be.a('number');
            expect(res.body.result.comment).to.be.a('array');
        });

        it (`boardId가 누락된 경우`, async() => {
            const res = await request(app)
                .get('/v1/comments')
                .set('Accept', 'application/json')
                .query({
                    page: 1,
                    size: 20
                });

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
            expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
            expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_EMPTY);
        });
    });
});
