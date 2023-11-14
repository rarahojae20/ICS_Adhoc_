import request from 'supertest';
import { app } from '../../src/app';
import { describe, it, before } from 'mocha';
import logger from '../../src/lib/logger';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
import { faker } from '@faker-js/faker';
import ApiCodes from '../../src/lib/api.codes';
import ApiMessages from '../../src/lib/api.messages';
import ApiDetailCodes from '../../src/lib/api.detail.codes';

chai.use(chaiSubset);
chai.use(chaiLike);
chai.use(chaiThings);

const expect = chai.expect;

const responseSuccessKeys = ['code', 'message', 'result'];
const responseFailedKeys = ['code', 'message', 'detail'];

const JPAddress = [{
	address: '富山県砺波市大門4番11号',
	postalCode: '9391316'
}, {
	address: '青森県北津軽郡鶴田町大巻3番12号',
	postalCode: '0383501'
}, {
	address: '兵庫県明石市和坂稲荷町23番16号',
	postalCode: '6730013'
}, {
	address: '滋賀県東近江市茨川町30番26号',
	postalCode: '5270216'
}, {
	address: '栃木県真岡市下大曽5番11号',
	postalCode: '3214543'
}];

const TWAddress = [{
	address: '桃園市桃園區懷寧二街15號',
	postalCode: '330'
}, {
	address: '臺中市梧棲區經一路23號',
	postalCode: '435'
}, {
	address: '臺南市新營區金華路4號',
	postalCode: '730'
}, {
	address: '嘉義市東區溪興街19號',
	postalCode: '600'
}, {
	address: '宜蘭縣冬山鄉龍祥四路25號',
	postalCode: '269'
}];

const VNAddress = [{
	address: 'Hẻm 60/4 Thạnh Xuân 31 3/9/26, Hồ Chí Minh, Hồ Chí Minh',
	postalCode: '71514'
}, {
	address: 'Công Trường Công Xã Paris 1, Hồ Chí Minh, Hồ Chí Minh',
	postalCode: '71006'
}, {
	address: 'Đường Trần Cao Vân 512, Thanh Khê, Đà Nẵng',
	postalCode: '50306'
}, {
	address: 'Phố Nguyễn Khuyến 11A, Hà Nội, Hà Nội',
	postalCode: '11508'
}, {
	address: 'Đường Trần Đại Nghĩa 192, Hồ Chí Minh, Hồ Chí Minh',
	postalCode: '71909'
}];

describe(`/v1/address API Test`, async () => {
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

            logger.log(`[ ${process.env.NODE_ENV} ] =========================================`);
        } catch (e) {
            console.log(e);
        }
    });

	describe(`주소 검증 실패 테스트`, () => {
		it('잘못된 국가 코드 입력', async () => {
			const res = await request(app)
			.get(`/v1/addr/verify/XX`)
			.query({
				address: faker.address.streetAddress(),
				postal_code: faker.random.numeric(5)
			});

			expect(res.body).to.have.keys(responseFailedKeys);
			expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
            expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
            expect(res.body.detail).to.be.a('object');
            expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_INVALID);
		});

		it('주소 검증 시 필수 파라미터(postal_code) 누락', async () => {
			const res = await request(app)
			.get(`/v1/addr/verify/JP`)
			.query({
				address: faker.address.streetAddress()
			});

			expect(res.body).to.have.keys(responseFailedKeys);
			expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
			expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
			expect(res.body.detail).to.be.a('object');
			expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_INVALID);
		});

		it('주소 검증 시 필수 파라미터(address) 누락', async () => {
			const res = await request(app)
			.get(`/v1/addr/verify/JP`)
			.query({
				postal_code: faker.random.numeric(5)
			});

			expect(res.body).to.have.keys(responseFailedKeys);
			expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
			expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
			expect(res.body.detail).to.be.a('object');
			expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_INVALID);
		});
	});

    describe(`일본 주소 검증`, () => {
		it('랜덤 일본 주소 검증', async () => {
			const {
				address,
				postalCode
			} = faker.helpers.arrayElement(JPAddress);

			const res = await request(app)
			.get(`/v1/addr/verify/JP`)
			.query({
				address, postal_code: postalCode
			});

			expect(res.body).to.have.keys(responseSuccessKeys);
			expect(res.body.code).to.equal(ApiCodes.OK);
			expect(res.body.result).to.include.keys(['office_code', 'area_code', 'postal_code']);
		});

		it('일본 주소 검증 시 잘못된 우편번호 입력', async () => {
			const { address } = faker.helpers.arrayElement(JPAddress);
			const postalCode = faker.random.numeric(6); // 일본 우편 번호는 7자리

			const res = await request(app)
			.get(`/v1/addr/verify/JP`)
			.query({
				address, postal_code: postalCode
			});

            expect(res.body).to.have.keys(responseFailedKeys);
			expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
			expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
			expect(res.body.detail).to.be.a('object');
			expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_INVALID);
		});

		it('일본 주소 검증 시 잘못된 주소를 입력', async () => {
			const { postalCode } = faker.helpers.arrayElement(JPAddress);
			const address = faker.address.streetAddress();

			const res = await request(app)
			.get(`/v1/addr/verify/JP`)
			.query({
				address, postal_code: postalCode
			});

            expect(res.body).to.have.keys(responseFailedKeys);
			expect(res.body.code).to.equal(ApiCodes.NOT_FOUND);
			expect(res.body.message).to.equal(ApiMessages.NOT_FOUND);
			expect(res.body.detail).to.be.a('object');
			expect(res.body.detail.code).to.equal(ApiDetailCodes.ADDR_NOT_FOUND);
		});
    });

});
