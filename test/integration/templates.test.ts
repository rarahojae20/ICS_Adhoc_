import { describe, it, before, after } from 'mocha';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
import request from 'supertest'; //Express 애플리케이션의 HTTP 요청
import { faker } from '@faker-js/faker'; // 랜덤한 데이터
import cache from 'memory-cache'; // 메모리 내에서 데이터를 임시로 저장

import { app } from '../../src/app'; // Express 애플리케이션의 객체
import { env } from '../../src/env'; //환경 변수 및 설정 값을 담고 있는 객체로 env.ts


import logger from '../../src/lib/logger'; //로깅을 관리하는 객체로, 초기화 및 로그 출력에 사용됩니다
import ApiCodes from '../../src/lib/api.codes'; // API 응답 코드
import ApiMessages from '../../src/lib/api.messages'; //메시지
import ApiDetailCodes from '../../src/lib/api.detail.codes'; //상세 코드 
import { Templates } from '../../src/models/templates.model'; //Sequelize ORM을 사용하여 데이터베이스 테이블
import { Op } from 'sequelize';

chai.use(chaiSubset);
chai.use(chaiLike);
chai.use(chaiThings);

const expect = chai.expect;

const responseSuccessKeys = ['code', 'message', 'result'];
const responseFailKeys = ['code', 'message', 'detail'];

describe(`/v1/templates API Test`, async () => { ///v1/templates API Test테스트 범위
  before(async () => {
    try {
      logger.init({ // 설정 초기화
        console: false, //불필요한 콘솔로그 x
        debug: true,
        log: true,
        error: true,
        info: true,
        fatal: true,
        sql: true,
        net: true,
      });
      logger.log(`[ ${env.mode.value} ] =========================================`); //env.ts에서  NODE_ENV process 통해 얻은 환경변수값 출력
    } catch (e) {
      console.log(e);
    }
  });

  /**
   * 추가할 테스트 케이스
   * 1. 템플릿 조회
   * - 모든 파라미터가 정상일 경우
   * 2. 템플릿 생성 성공
   * - 모든 파라미터가 정상일 경우
   * 3. 템플릿 생성 실패
   * - 파라미터가 없을 경우
   * - 파라미터가 잘못된 경우
   */
 
  describe(`템플릿 생성 실패 테스트`, () => { 
    it(`파라미터가 없을 경우`, async () => {
      const res = await request(app)  //express의 앤드포인트 테스트 하기우;해 supertest라이브러리 의 request사용
        .post('/v1/templates') //템플릿에 post여요청보내고
        .set('Accept', 'application/json'); //accept헤더를 application/json으로 설정해서 json형식의 응답을 받음

      expect(res.body).to.have.keys(responseFailKeys);  //응답으로 받은 키들이 responseFailKeys배열에 정의된 키들이 모두 존재하는지
      expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST); //응답으로 받은 코드들이 bad request들이 존재하는지
      expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
      expect(res.body.detail.code).to.equal(ApiDetailCodes.REQ_PARAM_EMPTY);

      console.log('템플릿 생성 실패 테스트 - 파라미터가 없을 경우: 성공');
    });

    it(`Template Name이 중복될 경우`, async () => {
      const res = await request(app)
        .post('/v1/templates')
        .set('Accept', 'application/json')
        .send({  //post요청시 보낼 데이터 설정
          title: faker.random.words(5),
          name: cache.get('templateName'),
          arguments: {
            user_id: faker.random.word(),
            redirect_url: faker.internet.url(), 
          },
          storage: {
            s3_key: faker.internet.url(), 
          },
        });

      expect(res.body).to.have.keys(responseFailKeys);
      expect(res.body.code).to.equal(ApiCodes.CONFLICT);
      expect(res.body.message).to.equal(ApiMessages.CONFLICT);
      expect(res.body.detail.code).to.equal(ApiDetailCodes.TEMPLATE_NAME_DUPLICATED);  

      console.log('템플릿 생성 실패 테스트 - Template Name이 중복될 경우: 성공');
    });
  });

  

  after(async () => {
    try {
      await Templates.destroy({
        where: {
          name: cache.get('templateName'), //   templateNAME 관련 데이터베이스 캐시 삭제 하여  테스트에서 사용한 임시 데이터가 다음 테스트에 영향을 미치지 않도록 
        },
      });
    } catch (e) {
      console.log(e);
    }
  });
});