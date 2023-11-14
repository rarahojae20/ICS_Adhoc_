import { Builder } from 'builder-pattern';

import { env } from '../../env';

import { IAxios } from '../../types/axios';

import Axios from '../../lib/axios';
import { setRakutenAuthKey, convertXmlToJSON } from '../../lib/utils';

const rakutenDefaultUrl = env.shopping['rakuten'].url;

export default class RakutenApiReader {
    /**
     * RMS에 등록하고 있는 상품 정보를 상품 관리 번호를 지정해 취득할 수 있다.
     *
     * @returns
     */
    async getItem() {
        const config = Builder<IAxios>()
            .headers({
                Authorization: setRakutenAuthKey()
            })
            .method('get')
            .url(rakutenDefaultUrl + '1.0/item/get')
            .params({
                itemUrl: 'item-url-201'
            })
            .build();

        const result = await Axios.setConfig(config).send();

        return convertXmlToJSON(result);
    }

    /**
     * RMS에 등록된 상품 정보를 검색한다.
     *
     * @returns
     */
    async searchItems() {
        const config = Builder<IAxios>()
            .headers({
                Authorization: setRakutenAuthKey()
            })
            .method('get')
            .url(rakutenDefaultUrl + '1.0/item/search')
            .params({
                itemName: 'ウイルス・花粉・防塵対策に使える不織布マスク'
            })
            .build();

        const result = await Axios.setConfig(config).send();

        return convertXmlToJSON(result);
    }

    /**
     * 수주를 검색한다.
    *
    * @returns
    */
   async searchOrders() {
        const config = Builder<IAxios>()
            .headers({
                'Content-Type': `application/json; charset=utf-8`,
                Authorization: setRakutenAuthKey()
            })
            .method('post')
            .url(rakutenDefaultUrl + '2.0/order/searchOrder')
            .data({
                dateType: 6, // 1: 주문일 2: 주문확인일 3: 주문확정일 4: 발송일 5: 발송완료보고일 6: 결제확정일
                startDatetime: '2022-09-01T00:00:00+0900', // 과거 730일(2년) 이내 주문 지정 가능
                endDatetime: '2022-11-22T18:00:00+0900', // 개시일로부터 63일 이내
                PaginationRequestModel: {
                    requestRecordsAmount: 1000, // 최대 1,000건까지 지정 가능
                    requestPage: 15,
                    SortModelList: [
                        {
                            sortColumn: 1, // 1: 주문일시
                            sortDirection: 1, // 1: 오름차순 2: 내림차순
                        },
                    ],
                },
                orderProgressList: [
                    // 상태목록
                    300, // 발송 대기
                    700, // 지불 절차 완료
                ],
                subStatusIdList: [
                    // 하위 상태 ID 목록
                    // 생성된 하위 상태를 지정하는 경우에는 여러 ID를 동시에 지정할 수 있습니다.
                    300, 700,
                ],
            })
            .build();

        return await Axios.setConfig(config).send();
    }

    /**
     * 수주의 상세정보를 가져옴.
     *
     * @returns
     */
    async getOrders() {
        const config = Builder<IAxios>()
            .headers({
                'Content-Type': `application/json; charset=utf-8`,
                Authorization: setRakutenAuthKey()
            })
            .method('post')
            .url(rakutenDefaultUrl + '2.0/order/getOrder')
            .data({
                orderNumberList: [
                    '502763-20171027-00006701',
                    '502763-20171027-00006702'
                ]
            })
            .build();

        return await Axios.setConfig(config).send();
    }

    /**
     * 주문 내용을 확인함.
     *
     * @returns
     */
    async confirmOrders() {
        const config = Builder<IAxios>()
            .headers({
                'Content-Type': `application/json; charset=utf-8`,
                Authorization: setRakutenAuthKey()
            })
            .method('post')
            .url(rakutenDefaultUrl + '2.0/order/confirmOrder')
            .data({
                orderNumberList: [
                    '502763-20171027-00006701',
                    '502763-20171027-00006702'
                ]
            })
            .build();

        return await Axios.setConfig(config).send();
    }

    /**
     * 라쿠텐 상품ID로 등록된 제품의 정보를 가져옵니다.
     *
     * @returns
     */
    async searchProduct() {
        const config = Builder<IAxios>()
            .headers({
                Authorization: setRakutenAuthKey()
            })
            .method('get')
            .url(rakutenDefaultUrl + '2.0/product/search')
            .params({
                productId: 'ny263'
            })
            .build();

        const result = await Axios.setConfig(config).send();

        return convertXmlToJSON(result);
    }

    /**
     * 주문 배송 정보를 수정합니다.
     */
    async updateOrderShipping() {
        // 테스트 단계에서는 사용X
    }

    /**
     * 발송완료보고 처리를 여러 건 일괄로 비동기 갱신한다.
     */
    async updateOrderShippingAsync() {
        // 테스트 단계에서는 사용X
    }

    /**
     * 발송완료보고 처리 결과를 확인한다.
     */
    async getResultUpdateOrderShippingAsync() {
        // 테스트 단계에서는 사용X
    }
}
