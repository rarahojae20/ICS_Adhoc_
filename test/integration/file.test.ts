import { describe, it, before } from 'mocha';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import cache from 'memory-cache';
import path from 'path';

import { app } from '../../src/app';
import { env } from '../../src/env';

import logger from '../../src/lib/logger';
import ApiCodes from '../../src/lib/api.codes';
import ApiMessages from '../../src/lib/api.messages';
import ApiDetailCodes from '../../src/lib/api.detail.codes';
import FileRepository from "../../src/api/v1/file/file.repository";

chai.use(chaiSubset);
chai.use(chaiLike);
chai.use(chaiThings);

const expect = chai.expect;

const responseSuccessKeys = ['code', 'message', 'result'];
const responseFailKeys = ['code', 'message', 'detail'];

describe(`/v1/boards API File Test`, async() => {
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


    describe(`파일 포함 공지사항 생성`, () => {
        it (`파일명 한글+영어+숫자+특수기호`, async () => {

            const res = await request(app)
                .post('/v1/boards')
                .set('Accept', 'application/json')
                .set('Content-type', 'multipart/form-data')
                .field('author', faker.random.words(1))
                .field('title', faker.random.words(5))
                .field('content', faker.random.words(100))
                .attach('images', path.resolve(__dirname, '../assets/가나다라ABCD마바사아1234!@#$%.PNG'))
                .attach('images', path.resolve(__dirname, '../assets/갉랷윯폷쟂챶.PNG'));

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
            expect(res.body.result.board).to.be.a('object');
            expect(res.body.result.board.files[0].storage.originalname).to.be.equal('가나다라ABCD마바사아1234!@#$%.PNG');
            expect(res.body.result.board.files[1].storage.originalname).to.be.equal('갉랷윯폷쟂챶.PNG');
            cache.put('notice', res.body.result.board._id);

            const files = await new FileRepository().findAll({ board_id : cache.get('notice')});
            expect(files.length).to.equal(2);
        });
    });


    describe(`공지사항 수정`, () => {
        it (`파일명 한글+영어+숫자`, async function()  {
            this.timeout(10000);
            const id = cache.get('notice');
            const res = await request(app)
                .put(`/v1/boards/${id}`)
                .set('Content-type', 'multipart/form-data')
                .field('author', 'modify author success')
                .field('title', 'modify title success')
                .field('content', 'modify content success')
                .attach('images', path.resolve(__dirname, '../assets/이건수정abcd된1234것.PNG'))
                .attach('images', path.resolve(__dirname, '../assets/이건수정abcd된1234것.PNG'));

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
            expect(res.body.result.board).to.be.a('object');
            expect(res.body.result.board.files).to.be.a('array');
            expect(res.body.result.board.files[0].storage.originalname).to.equal('이건수정abcd된1234것.PNG');
            expect(res.body.result.board.files[1].storage.originalname).to.equal('이건수정abcd된1234것.PNG');
        });
    });


    describe(`공지사항 삭제`, () => {
        it(`정상 동작 시`, async () => {
            const id = cache.get('notice');
            const res = await request(app)
                .delete(`/v1/boards/${id}`)
                .set('Accept', 'application/json')
                .send();

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
            expect(res.body.result.board).to.be.a('object');
            expect(res.body.result.board.files).to.be.a('array');

            const files = await new FileRepository().findAll({ board_id: id });
            expect(files.length).to.equal(0);
        });
    });
});
