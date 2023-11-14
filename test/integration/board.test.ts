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

describe(`/v1/boards API Test`, async() => {
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

    describe(`공지사항 생성`, () => {
        it (`정상 동작 시 (파일 포함)`, async() => {
            const res = await request(app)
                .post('/v1/boards')
                .set('Accept', 'application/json')
                .set('Content-type', 'multipart/form-data')
                .field('author', faker.random.words(1))
                .field('title', faker.random.words(5))
                .field('content', faker.random.words(100))
                .attach('images', path.resolve(__dirname, '../assets/가나다라ABCD마바사아1234!@#$%.PNG'))
                .attach('images', path.resolve(__dirname, '../assets/갉랷윯폷쟂챶.PNG'))
                .attach('images', path.resolve(__dirname, '../assets/mongu.jpg'));

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
            expect(res.body.result.board).to.be.a('object');
            expect(res.body.result.board.files.length).to.equal(3);
            cache.put('notice_file', res.body.result.board._id);

            const files = await new FileRepository().findAll({ board_id : cache.get('notice_file') });
            expect(files.length).to.equal(3);
            expect(files[0].storage['originalname']).to.equal('가나다라ABCD마바사아1234!@#$%.PNG');
            expect(files[1].storage['originalname']).to.equal('갉랷윯폷쟂챶.PNG');
            expect(files[2].storage['originalname']).to.equal('mongu.jpg');
        });

//         it (`정상 동작 시 (파일 미 포함)`, async() => {
//             const res = await request(app)
//                 .post('/v1/boards')
//                 .set('Accept', 'application/json')
//                 .set('Content-type', 'multipart/form-data')
//                 .field('author', faker.random.words(1))
//                 .field('title', faker.random.words(5))
//                 .field('content', faker.random.words(100));

//             expect(res.body).to.have.keys(responseSuccessKeys);
//             expect(res.body.code).to.equal(ApiCodes.OK);
//             expect(res.body.message).to.equal(ApiMessages.OK);
//             expect(res.body.result).to.be.a('object');
//             expect(res.body.result.board).to.be.a('object');
//             cache.put('notice', res.body.result.board._id);
//         });

//         it (`파라미터의 값이 없을 경우`, async() => {
//             const res = await request(app)
//                 .post('/v1/boards')
//                 .set('Accept', 'application/json')
//                 .set('Content-type', 'multipart/form-data')
//                 .field('author', '')
//                 .field('title', '')
//                 .field('content', '');

//             expect(res.body).to.have.keys(responseFailKeys);
//             expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
//             expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
//             expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_EMPTY);
//         });
//     });

//     describe(`공지사항 조회`, () => {
//         it (`정상 동작 시 (page, size가 없을 경우)`, async() => {
//             const res = await request(app)
//                 .get('/v1/boards')
//                 .set('Accept', 'application/json')
//                 .query({});

//             expect(res.body).to.have.keys(responseSuccessKeys);
//             expect(res.body.code).to.equal(ApiCodes.OK);
//             expect(res.body.message).to.equal(ApiMessages.OK);
//             expect(res.body.result).to.be.a('object');
//             expect(res.body.result.count).to.be.a('number');
//             expect(res.body.result.board).to.be.a('array');
//         });

//         it (`정상 동작 시 (page, size가 있을 경우)`, async() => {
//             const res = await request(app)
//                 .get('/v1/boards')
//                 .set('Accept', 'application/json')
//                 .query({
//                     page: 1,
//                     size: 20
//                 });

//             expect(res.body).to.have.keys(responseSuccessKeys);
//             expect(res.body.code).to.equal(ApiCodes.OK);
//             expect(res.body.message).to.equal(ApiMessages.OK);
//             expect(res.body.result).to.be.a('object');
//             expect(res.body.result.count).to.be.a('number');
//             expect(res.body.result.board).to.be.a('array');
//         });

//         it (`page, size가 문자인 경우`, async() => {
//             const res = await request(app)
//                 .get('/v1/boards')
//                 .set('Accept', 'application/json')
//                 .send({
//                     page: 'a',
//                     size: 'b'
//                 });

//             expect(res.body).to.have.keys(responseSuccessKeys);
//             expect(res.body.code).to.equal(ApiCodes.OK);
//             expect(res.body.message).to.equal(ApiMessages.OK);
//             expect(res.body.result).to.be.a('object');
//             expect(res.body.result.count).to.be.a('number');
//             expect(res.body.result.board).to.be.a('array');
//         });
//     });

//     describe(`공지사항 상세 조회`, () => {
//         it (`정상 동작 시`, async() => {
//             const id = cache.get('notice_file');
//             const res = await request(app)
//                 .get(`/v1/boards/${id}`)
//                 .set('Accept', 'application/json')
//                 .send();

//             console.log(res.body.result);
//             expect(res.body).to.have.keys(responseSuccessKeys);
//             expect(res.body.code).to.equal(ApiCodes.OK);
//             expect(res.body.message).to.equal(ApiMessages.OK);
//             expect(res.body.result).to.be.a('object');
//             expect(res.body.result.board.files.length).to.equal(3);
//             expect(res.body.result.board.files[0].storage['originalname']).to.equal('가나다라ABCD마바사아1234!@#$%.PNG');
//             expect(res.body.result.board.files[1].storage['originalname']).to.equal('갉랷윯폷쟂챶.PNG');
//             expect(res.body.result.board.files[2].storage['originalname']).to.equal('mongu.jpg');
//         });

//         it (`상세 조회시 id가 문자인 경우`, async() => {
//             const id = 'qwer';
//             const res = await request(app)
//                 .get(`/v1/boards/${id}`)
//                 .set('Accept', 'application/json')
//                 .send();

//             expect(res.body).to.have.keys(responseFailKeys);
//             expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
//             expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
//             expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_INVALID);
//         });
//     });

//     describe(`공지사항 수정`, () => {
//         it (`정상 동작 시 (파일 포함)`, async() => {
//             const id = cache.get('notice_file');
//             const res = await request(app)
//                 .put(`/v1/boards/${id}`)
//                 .set('Content-type', 'multipart/form-data')
//                 .field('author', 'modify author success')
//                 .field('title', 'modify title success')
//                 .field('content', 'modify content success')
//                 .attach('images', path.resolve(__dirname, '../assets/이건수정abcd된1234것.PNG'));

//             expect(res.body).to.have.keys(responseSuccessKeys);
//             expect(res.body.code).to.equal(ApiCodes.OK);
//             expect(res.body.message).to.equal(ApiMessages.OK);
//             expect(res.body.result).to.be.a('object');
//             expect(res.body.result.board).to.be.a('object');
//             expect(res.body.result.board.files).to.be.a('array');
//             expect(res.body.result.board.files.length).to.equal(1);

//             const files = await new FileRepository().findAll({ board_id : cache.get('notice_file') });
//             expect(files.length).to.equal(1);
//             expect(files[0].storage['originalname']).to.equal('이건수정abcd된1234것.PNG');
//         });

//         it (`정상 동작 시 (파일 미 포함)`, async() => {
//             const id = cache.get('notice');
//             console.log(id);
//             const res = await request(app)
//                 .put(`/v1/boards/${id}`)
//                 .set('Content-type', 'multipart/form-data')
//                 .field('author', faker.random.words(1))
//                 .field('title', faker.random.words(5))
//                 .field('content', faker.random.words(100));

//             expect(res.body).to.have.keys(responseSuccessKeys);
//             expect(res.body.code).to.equal(ApiCodes.OK);
//             expect(res.body.message).to.equal(ApiMessages.OK);
//             expect(res.body.result).to.be.a('object');
//             expect(res.body.result.board).to.be.a('object');
//         });

//         it (`파라미터의 값이 모두 길이가 0인 경우`, async() => {
//             const res = await request(app)
//                 .put('/v1/boards/0')
//                 .set('Content-type', 'multipart/form-data')
//                 .field('author', '')
//                 .field('title', '')
//                 .field('content', '');

//             expect(res.body).to.have.keys(responseFailKeys);
//             expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
//             expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
//             expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_EMPTY);
//         });
//     });

//     describe(`공지사항 삭제`, () => {
//         it (`정상 동작 시`, async() => {
//             const id = cache.get('notice_file');
//             const res = await request(app)
//                 .delete(`/v1/boards/${id}`)
//                 .set('Accept', 'application/json')
//                 .send();

//             expect(res.body).to.have.keys(responseSuccessKeys);
//             expect(res.body.code).to.equal(ApiCodes.OK);
//             expect(res.body.message).to.equal(ApiMessages.OK);
//             expect(res.body.result).to.be.a('object');
//             expect(res.body.result.board).to.be.a('object');
//             expect(res.body.result.board.files).to.be.a('array');

//             const files = await new FileRepository().findAll({ board_id : cache.get('notice_file') });
//             expect(files.length).to.equal(0);
//         });

//         it (`삭제했던 게시글 다시 삭제시`, async() => {
//             const id = cache.get('notice_file');
//             const res = await request(app)
//                 .delete(`/v1/boards/${id}`)
//                 .set('Accept', 'application/json')
//                 .send();

//             expect(res.body).to.have.keys(responseFailKeys);
//             expect(res.body.code).to.equal(ApiCodes.NOT_FOUND);
//             expect(res.body.message).to.equal(ApiMessages.NOT_FOUND);
//             expect(res.body.detail.code).to.equal(ApiDetailCodes.BOARD_VALUE_NULL);
//         });
//     });

//     describe(`CS관리 생성`, () => {
//         it (`정상 동작 시 (파일 포함)`, async() => {
//             const res = await request(app)
//                 .post('/v1/boards')
//                 .set('Accept', 'application/json')
//                 .set('Content-type', 'multipart/form-data')
//                 .field('author', faker.random.words(1))
//                 .field('title', faker.random.words(5))
//                 .field('content', faker.random.words(100))
//                 .field('order_no', faker.random.words(1))
//                 .field('cs_type', faker.random.words(1))
//                 .field('item_type', faker.random.words(1))
//                 .field('stock_type', faker.random.words(1))
//                 .field('sku', faker.random.words(1))
//                 .field('recipient_id', 1) // 일단 1로 고정
//                 .field('shipped_at', new Date().toISOString())
//                 .field('delivered_at', new Date().toISOString())
//                 .attach('images', path.resolve(__dirname, '../assets/mongu.jpg'))
//                 .attach('images', path.resolve(__dirname, '../assets/mongu.jpg'))
//                 .attach('images', path.resolve(__dirname, '../assets/mongu.jpg'));

//             expect(res.body).to.have.keys(responseSuccessKeys);
//             expect(res.body.code).to.equal(ApiCodes.OK);
//             expect(res.body.message).to.equal(ApiMessages.OK);
//             expect(res.body.result).to.be.a('object');
//             cache.put('id', res.body.result.board._id);
//             cache.put('cs_id', res.body.result.board.cs_id);
//         });

//         it (`정상 동작 시 (파일 미 포함)`, async() => {
//             const res = await request(app)
//                 .post('/v1/boards')
//                 .set('Accept', 'application/json')
//                 .set('Content-type', 'multipart/form-data')
//                 .field('author', faker.random.words(1))
//                 .field('title', faker.random.words(5))
//                 .field('content', faker.random.words(100))
//                 .field('order_no', faker.random.words(1))
//                 .field('cs_type', faker.random.words(1))
//                 .field('item_type', faker.random.words(1))
//                 .field('stock_type', faker.random.words(1))
//                 .field('sku', faker.random.words(1))
//                 .field('recipient_id', 1) // 일단 1로 고정
//                 .field('shipped_at', new Date().toISOString())
//                 .field('delivered_at', new Date().toISOString());

//             expect(res.body).to.have.keys(responseSuccessKeys);
//             expect(res.body.code).to.equal(ApiCodes.OK);
//             expect(res.body.message).to.equal(ApiMessages.OK);
//             expect(res.body.result).to.be.a('object');
//         });

//         it (`파라미터의 값이 없을 경우`, async() => {
//             const res = await request(app)
//                 .post('/v1/boards')
//                 .set('Accept', 'application/json')
//                 .set('Content-type', 'multipart/form-data')
//                 .field('author', '')
//                 .field('title', '')
//                 .field('content', '')
//                 .field('order_no', '')
//                 .field('cs_type', '')
//                 .field('item_type', '')
//                 .field('stock_type', '')
//                 .field('sku', '')
//                 .field('recipient_id', 1) // 일단 1로 고정
//                 .field('shipped_at', '')
//                 .field('delivered_at', '');

//             expect(res.body).to.have.keys(responseFailKeys);
//             expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
//             expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
//             expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_EMPTY);
//         });
//     });

//     describe(`CS관리 조회`, () => {
//         it (`정상 동작 시`, async() => {
//             const res = await request(app)
//                 .get('/v1/boards')
//                 .set('Accept', 'application/json')
//                 .query({
//                     type: 'cs'
//                 });

//             expect(res.body).to.have.keys(responseSuccessKeys);
//             expect(res.body.code).to.equal(ApiCodes.OK);
//             expect(res.body.message).to.equal(ApiMessages.OK);
//             expect(res.body.result).to.be.a('object');
//             expect(res.body.result.count).to.be.a('number');
//             expect(res.body.result.board).to.be.a('array');
//         });

//         /**
//          * 값이 누락된 경우 공지사항의 값이 넘어옴.
//          * 이에 API명세서에 이 부분을 자세히 설명할 필요가 있음.
//          */
//         it (`값이 누락된 경우`, async() => {
//             const res = await request(app)
//                 .get('/v1/boards')
//                 .set('Accept', 'application/json')
//                 .query({});

//             expect(res.body).to.have.keys(responseSuccessKeys);
//             expect(res.body.code).to.equal(ApiCodes.OK);
//             expect(res.body.message).to.equal(ApiMessages.OK);
//             expect(res.body.result).to.be.a('object');
//             expect(res.body.result.count).to.be.a('number');
//             expect(res.body.result.board).to.be.a('array');
//         });
//     });

//     describe(`CS관리 상세 조회`, () => {
//         it (`정상 동작 시`, async() => {
//             const id = cache.get('id');
//             const res = await request(app)
//                 .get(`/v1/boards/${id}`)
//                 .set('Accept', 'application/json')
//                 .send();

//             expect(res.body).to.have.keys(responseSuccessKeys);
//             expect(res.body.code).to.equal(ApiCodes.OK);
//             expect(res.body.message).to.equal(ApiMessages.OK);
//             expect(res.body.result).to.be.a('object');
//         });

//         it (`상세 조회시 id가 문자인 경우`, async() => {
//             const id = 'qwer';
//             const res = await request(app)
//                 .get(`/v1/boards/${id}`)
//                 .set('Accept', 'application/json')
//                 .send();

//             expect(res.body).to.have.keys(responseFailKeys);
//             expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
//             expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
//             expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_INVALID);
//         });
//     });

//     describe(`CS관리 수정`, () => {
//         it (`정상 동작 시 (파일 포함)`, async() => {
//             const id = cache.get('id');
//             const res = await request(app)
//                 .put(`/v1/boards/${id}`)
//                 .set('Content-type', 'multipart/form-data')
//                 .field('cs_id', cache.get('cs_id'))
//                 .field('author', faker.random.words(1))
//                 .field('title', faker.random.words(5))
//                 .field('content', faker.random.words(100))
//                 .field('order_no', faker.random.words(1))
//                 .field('cs_type', faker.random.words(1))
//                 .field('item_type', faker.random.words(1))
//                 .field('stock_type', faker.random.words(1))
//                 .field('sku', faker.random.words(1))
//                 .field('recipient_id', 1) // 일단 1로 고정
//                 .field('shipped_at', new Date().toISOString())
//                 .field('delivered_at', new Date().toISOString())
//                 .attach('images', path.resolve(__dirname, '../assets/mongu.jpg'))
//                 .attach('images', path.resolve(__dirname, '../assets/mongu.jpg'))
//                 .attach('images', path.resolve(__dirname, '../assets/mongu.jpg'));

//             expect(res.body).to.have.keys(responseSuccessKeys);
//             expect(res.body.code).to.equal(ApiCodes.OK);
//             expect(res.body.message).to.equal(ApiMessages.OK);
//             expect(res.body.result).to.be.a('object');
//             expect(res.body.result.board).to.be.a('object');
//             expect(res.body.result.board.files).to.be.a('array');
//             expect(res.body.result.board.cs).to.be.a('object');
//         });

//         it (`정상 동작 시 (파일 미 포함)`, async() => {
//             const id = cache.get('id');
//             const res = await request(app)
//                 .put(`/v1/boards/${id}`)
//                 .set('Content-type', 'multipart/form-data')
//                 .field('cs_id', cache.get('cs_id'))
//                 .field('author', faker.random.words(1))
//                 .field('title', faker.random.words(5))
//                 .field('content', faker.random.words(100))
//                 .field('order_no', faker.random.words(1))
//                 .field('cs_type', faker.random.words(1))
//                 .field('item_type', faker.random.words(1))
//                 .field('stock_type', faker.random.words(1))
//                 .field('sku', faker.random.words(1))
//                 .field('recipient_id', 1) // 일단 1로 고정
//                 .field('shipped_at', new Date().toISOString())
//                 .field('delivered_at', new Date().toISOString());

//             expect(res.body).to.have.keys(responseSuccessKeys);
//             expect(res.body.code).to.equal(ApiCodes.OK);
//             expect(res.body.message).to.equal(ApiMessages.OK);
//             expect(res.body.result).to.be.a('object');
//             expect(res.body.result.board).to.be.a('object');
//         });

//         it (`파라미터의 값이 모두 길이가 0인 경우`, async() => {
//             const res = await request(app)
//                 .put('/v1/boards/0')
//                 .set('Content-type', 'multipart/form-data')
//                 .field('author', '')
//                 .field('title', '')
//                 .field('content', '')
//                 .field('order_no', '')
//                 .field('cs_type', '')
//                 .field('item_type', '')
//                 .field('stock_type', '')
//                 .field('sku', '')
//                 .field('recipient_id', 1) // 일단 1로 고정
//                 .field('shipped_at', '')
//                 .field('delivered_at', '');

//             expect(res.body).to.have.keys(responseFailKeys);
//             expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
//             expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
//             expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_EMPTY);
//         });
//     });

//     describe(`CS관리 삭제`, () => {
//         it (`정상 동작 시`, async() => {
//             const id = cache.get('id');
//             const res = await request(app)
//                 .delete(`/v1/boards/${id}`)
//                 .set('Accept', 'application/json')
//                 .send();

//             expect(res.body).to.have.keys(responseSuccessKeys);
//             expect(res.body.code).to.equal(ApiCodes.OK);
//             expect(res.body.message).to.equal(ApiMessages.OK);
//             expect(res.body.result).to.be.a('object');
//             expect(res.body.result.board).to.be.a('object');
//             expect(res.body.result.board.files).to.be.a('array');
//             expect(res.body.result.board.cs).to.be.a('object');
//         });

//         it (`삭제했던 게시글 다시 삭제시`, async() => {
//             const id = cache.get('id');
//             const res = await request(app)
//                 .delete(`/v1/boards/${id}`)
//                 .set('Accept', 'application/json')
//                 .send();

//             expect(res.body).to.have.keys(responseFailKeys);
//             expect(res.body.code).to.equal(ApiCodes.NOT_FOUND);
//             expect(res.body.message).to.equal(ApiMessages.NOT_FOUND);
//             expect(res.body.detail.code).to.equal(ApiDetailCodes.BOARD_VALUE_NULL);
//         });
});
});
