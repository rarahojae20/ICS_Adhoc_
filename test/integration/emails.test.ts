import { describe, it, before, after } from 'mocha';
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
import { Templates } from '../../src/models/templates.model';
import { Emails } from '../../src/models/emails.model';

chai.use(chaiSubset);
chai.use(chaiLike);
chai.use(chaiThings);

const expect = chai.expect;

const responseSuccessKeys = ['code', 'message', 'result'];
const responseFailKeys = ['code', 'message', 'detail'];
const sentEmailList = [];

describe(`/v1/emails API Test`, async() => {
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

    describe(`이메일 전송 성공`, () => {
        before(async() => {
            const res = await request(app)
                .post('/v1/templates')
                .set('Accept', 'application/json')
                .send({
                    name: faker.random.word(),
                    title: '테스트용 이메일 템플릿',
                    arguments: {
                        user_id: 'user id',
                        redirect_url: 'redirect url'
                    },
                    storage: {
                        s3_key: 'email-templates/template1.ejs'
                    }
                });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.have.keys(['_id', 'name', 'title', 'arguments', 'storage']);

            cache.put('template_id', res.body.result._id);
        });

        it (`모든 파라미터가 정상일 경우`, async() => {
            const res = await request(app)
                .post('/v1/emails')
                .set('Accept', 'application/json')
                .send({
                    to: `${faker.internet.userName()}@sisoul.co.kr`,
                    title: faker.random.words(5),
                    template: {
                        id: cache.get('template_id'),
                        arguments: {
                            user_id: faker.internet.userName(),
                            redirect_url: faker.internet.url()
                        }
                    }
                });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
            expect(res.body.result.message_id).to.be.a('string');
            expect(res.body.result.status).to.equal('success');

            sentEmailList.push(Buffer.from(res.body.result.message_id, 'base64').toString('ascii'));
        });

        it (`title이 없을 경우`, async() => {
            const res = await request(app)
                .post('/v1/emails')
                .set('Accept', 'application/json')
                .send({
                    to: `${faker.internet.userName()}@sisoul.co.kr`,
                    template: {
                        id: cache.get('template_id'),
                        arguments: {
                            user_id: faker.internet.userName(),
                            redirect_url: faker.internet.url()
                        }
                    }
                });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
            expect(res.body.result.message_id).to.be.a('string');
            expect(res.body.result.status).to.equal('success');

            sentEmailList.push(Buffer.from(res.body.result.message_id, 'base64').toString('ascii'));
        });
    });

    describe(`이메일 전송 실패`, () => {
        it (`템플릿을 특정할 수 있는 id, name이 없을 경우`, async() => {
            const res = await request(app)
                .post('/v1/emails')
                .set('Accept', 'application/json')
                .send({
                    to: `${faker.internet.userName()}@sisoul.co.kr`,
                    title: faker.random.words(5),
                    template: {
                        arguments: {
                            user_id: faker.internet.userName(),
                            redirect_url: faker.internet.url()
                        }
                    }
                });

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
            expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
            expect(res.body.detail).to.be.a('object');
            expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_EMPTY);
        });

        it (`template의 arguments가 일치하지 않을 경우`, async() => {
            const res = await request(app)
                .post('/v1/emails')
                .set('Accept', 'application/json')
                .send({
                    to: `${faker.internet.userName()}@sisoul.co.kr`,
                    title: faker.random.words(5),
                    template: {
                        id: cache.get('template_id'),
                        arguments: {
                            unmatched_variable: faker.internet.userName(),
                        }
                    }
                });

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
            expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
            expect(res.body.detail.code).to.equal(ApiDetailCodes.EMAIL_TEMPLATE_VAR_NOT_MATCH);
        });

        it (`수신자 이메일이 잘못된 경우`, async() => {
            const res = await request(app)
                .post('/v1/emails')
                .set('Accept', 'application/json')
                .send({
                    to: faker.internet.email(),
                    title: faker.random.words(5),
                    template: {
                        id: cache.get('template_id'),
                        arguments: {
                            user_id: faker.internet.userName(),
                            redirect_url: faker.internet.url()
                        }
                    }
                });

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
            expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
            expect(res.body.detail.code).to.equal(ApiDetailCodes.EMAIL_ADDRESS_INVALID);

        });
    });

    after(async () => {
        try {
            await Templates.destroy({
                where: {
                    _id: cache.get('template_id'),
                }
            });

            for (let i = 0; i < sentEmailList.length; i++) {
                await Emails.destroy({
                    where: {
                        message_id: sentEmailList[i]
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }
    });
});
