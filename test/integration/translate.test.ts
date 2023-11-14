import { describe, it, before } from 'mocha';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
import request from 'supertest';
import { faker } from '@faker-js/faker';
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

describe(`/v1/translate API Test`, async() => {
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

    describe(`구글 번역 시작`, () => {
        it (`정상 동작 시`, async() => {
            const localization = faker.random.locale();
            faker.setLocale(localization);

            const res = await request(app)
            .post('/v1/translate')
            .set('Accept', 'application/json')
            .send({
                content: faker.random.words(5),
                targetLanguageCode: 'ko'
            });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('string');
        });

        it (`content 길이가 0일 때`, async() => {
            const res = await request(app)
            .post('/v1/translate')
            .set('Accept', 'application/json')
            .send({
                content: '',
                targetLanguageCode: 'ko'
            });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('string');
        });

        it (`content 누락 시`, async() => {
            const res = await request(app)
            .post('/v1/translate')
            .set('Accept', 'application/json')
            .send({
                targetLanguageCode: 'ko'
            });

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
            expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
            expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_EMPTY);
        });

        it (`content가 하나만 특수문자일 때`, async() => {
            const localization = faker.random.locale();
            faker.setLocale(localization);

            const res = await request(app)
            .post('/v1/translate')
            .set('Accept', 'application/json')
            .send({
                content: `^ ${faker.random.words(5)}`,
                targetLanguageCode: 'ko'
            });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('string');
        });

        // 테스트 결과 무조건 한글을 우선적으로 감지.
        it (`영어와 한글이 같이 있는 content를 스페인어로 변역할 경우`, async() => {
            const res = await request(app)
            .post('/v1/translate')
            .set('Accept', 'application/json')
            .send({
                content: `${faker.random.words(5)} 안녕하세요. 감사해요. 잘 있어요. 다시 만나요.`,
                targetLanguageCode: 'es'
            });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('string');
        });

        // 테스트 결과 무조건 한글을 우선적으로 감지.
        it (`영어와 한글이 같이 있는 content를 영어로 변역할 경우`, async() => {
            const res = await request(app)
            .post('/v1/translate')
            .set('Accept', 'application/json')
            .send({
                content: `${faker.random.words(5)} 안녕하세요. 감사해요. 잘 있어요. 다시 만나요.`,
                targetLanguageCode: 'en'
            });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('string');
        });

        // 테스트 결과 무조건 한글을 우선적으로 감지.
        it (`영어와 한글의 순서를 바꾼 content를 영어로 변역할 경우`, async() => {
            const res = await request(app)
            .post('/v1/translate')
            .set('Accept', 'application/json')
            .send({
                content: `안녕하세요. 감사해요. 잘 있어요. 다시 만나요. ${faker.random.words(5)}`,
                targetLanguageCode: 'en'
            });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('string');
        });

        /**
         * faker.random.locale()이 영어권의 국가 또는 다른 언어를 사용하는 국가를 나타냄
         * targetLanguageCode가 없을 때의 기본값이 영어를 사용함.
         * sourceLanguageCode And targetLanguageCode is Conflict 오류가 발생하면서 테스트에 어려움이 있음
         * 추후에 다른 방법으로 테스트를 해야 함.
        it (`targetLanguageCode 누락 시`, async() => {
            const localization = faker.random.locale();
            faker.setLocale(localization);

            const res = await request(app)
            .post('/v1/translate')
            .set('Accept', 'application/json')
            .send({
                content: faker.random.words(5),
            });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('string');
        });
        */

        /**
         * faker.random.locale()이 영어권의 국가 또는 다른 언어를 사용하는 국가를 나타냄
         * targetLanguageCode가 없을 때의 기본값이 영어를 사용함.
         * sourceLanguageCode And targetLanguageCode is Conflict 오류가 발생하면서 테스트에 어려움이 있음
         * 추후에 다른 방법으로 테스트를 해야 함.
        it (`targetLanguageCode 길이가 0일 때`, async() => {
            const localization = faker.random.locale();
            faker.setLocale(localization);

            const res = await request(app)
            .post('/v1/translate')
            .set('Accept', 'application/json')
            .send({
                content: faker.random.words(5),
                targetLanguageCode: ''
            });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('string');
        });
        */

        it (`targetLanguageCode가 잘못되었을 때`, async() => {
            const localization = faker.random.locale();
            faker.setLocale(localization);

            const res = await request(app)
            .post('/v1/translate')
            .set('Accept', 'application/json')
            .send({
                content: faker.random.words(5),
                targetLanguageCode: 'cn'
            });

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
            expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
            expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_SUPPORT_LANGUAGES_WRONG);
        });

        it (`content와 targetLanguageCode의 길이가 전부 0일 때`, async() => {
            const res = await request(app)
            .post('/v1/translate')
            .set('Accept', 'application/json')
            .send({
                content: '',
                targetLanguageCode: ''
            });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('string');
        });

        it (`content와 targetLanguageCode가 전부 누락된 경우`, async() => {
            const res = await request(app)
            .post('/v1/translate')
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
            expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
            expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_EMPTY);
        });
    });
});
