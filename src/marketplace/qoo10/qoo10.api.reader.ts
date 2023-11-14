import { Builder } from 'builder-pattern';

import { env } from '../../env';

import { IAxios } from '../../types/axios';

import Axios from '../../lib/axios';
import { setQoo10Params } from '../../lib/utils';

const qoo10DefaultUri = env.shopping['qoo10'].uri;

export default class Qoo10ApiReader {
    /* 상품 정보 조회 */

    /**
     * Qoo10에 등록한 상품의 단일형 옵션 정보를 조회
     * Qoo10 상품 코드 또는 판매자 상품 코드 중 하나는 필수 입력
     * @param key
     * @param itemCode Qoo10 상품 코드, Length 9
     * @param sellerCode 판매자 관리하고 있는 상품의 코드, Length Max 100
     */
    public getGoodsOptionInfo = async (key: string, itemCode: string, sellerCode: string) => {
        const config = Builder<IAxios>()
            .method('get')
            .url(qoo10DefaultUri)
            .params(setQoo10Params({
                method: 'ItemsLookup.GetGoodsOptionInfo',
                ItemCode: itemCode,
                SellerCode: sellerCode,
                key,
            }))
            .build();

        return await Axios.setConfig(config).send();
    };

    /**
     * Qoo10에 등록한 판매 상품의 조합형 옵션 정보를 조회
     * Qoo10 상품 코드 또는 판매자 상품 코드 중 하나는 필수 입력
     * @param key
     * @param itemCode Qoo10 상품 코드, Length 9
     * @param sellerCode 판매자 관리하고 있는 상품의 코드, Length Max 100
     */
    public getGoodsInventoryInfo = async (key: string, itemCode: string, sellerCode: string) => {
        const config = Builder<IAxios>()
            .method('get')
            .url(qoo10DefaultUri)
            .params(setQoo10Params({
                method: 'ItemsLookup.GetGoodsOptionInfo',
                ItemCode: itemCode,
                SellerCode: sellerCode,
                key,
            }))
            .build();

        return await Axios.setConfig(config).send();
    };

    /**
     * 판매자의 배송 정보를 조회
     * @param key
     */
    public getSellerDeliveryGroupInfo = async (key: string) => {
        const config = Builder<IAxios>()
            .method('get')
            .url(qoo10DefaultUri)
            .params(setQoo10Params({
                method: 'ItemsLookup.GetSellerDeliveryGroupInfo',
                key,
            }))
            .build();

        return await Axios.setConfig(config).send();
    };

    /**
     * 상품 코드를 입력하여 단일 상품의 상품 정보를 조회
     * Qoo10 상품 코드 또는 판매자 상품 코드 중 하나는 필수 입력
     * @param key
     * @param itemCode Qoo10 상품 코드, Length 9
     * @param sellerCode 판매자 관리하고 있는 상품의 코드, Length Max 100
     */
    public getItemDetailInfo = async (key: string, itemCode: string, sellerCode: string) => {
        const config = Builder<IAxios>()
            .method('get')
            .url(qoo10DefaultUri)
            .params(setQoo10Params({
                method: 'ItemsLookup.GetItemDetailInfo',
                ItemCode: itemCode,
                SellerCode: sellerCode,
                key,
            }))
            .build();

        return await Axios.setConfig(config).send();
    };

    /**
     * 판매자가 등록한 상품의 거래 상태별 조회
     * (1 페이지에 최대 500개까지의 상품이 조회가 가능. 페이지를 지정 표시할 수 있습니다.)
     * @param key
     * @param itemStatus 상품 거래 상황 (검수 대기 = S0, 거래 대기 = S1, 거래 가능 = S2, 거래 폐지 = S4)
     * @param page 0~2147483647
     */
    public getAllGoodsInfo = async (key: string, itemStatus: string, page: string) => {
        const config = Builder<IAxios>()
            .method('get')
            .url(qoo10DefaultUri)
            .params(setQoo10Params({
                method: 'ItemsLookup.GetAllGoodsInfo',
                ItemStatus: itemStatus,
                Page: page,
                key,
            }))
            .build();

        return await Axios.setConfig(config).send();
    };

    /* 배송 / 취소 정보 조회 */

    /**
     * 판매자의 배송 상태에 관한 정보를 조회
     * @param key
     * @param shippingBasic 배송 상태 (1: 배송 대기, 2: 배송 요청, 3: 배송 준비, 4: 배송 중, 5: 배송 완료)
     * @param search_Sdate 조회 시작 ex) 20190101 (yyyyMMdd), 20190101153000 (yyyyMMddHHmmss)
     * @param search_Edate 조회 종료 ex) 20190101 (yyyyMMdd), 20190101153000 (yyyyMMddHHmmss)
     * @param search_condition 날짜 유형 (1: 주문일, 2: 결제 완료일, 3: 배송일, 4: 배송 완료일)
     */
    public getShippingInfo_v2 = async (key: string, shippingBasic: string, search_Sdate: string, search_Edate: string, search_condition: string) => {
        const config = Builder<IAxios>()
            .method('get')
            .url(qoo10DefaultUri)
            .params(setQoo10Params({
                method: 'ShippingBasic.GetShippingInfo_v2',
                ShippingStat: shippingBasic,
                search_Sdate: search_Sdate,
                search_Edate: search_Edate,
                search_condition: search_condition,
                key,
            }))
            .build();

        return await Axios.setConfig(config).send();
    };

    /**
     * 판매자의 주문 단일 건 배송/클레임 정보를 조회
     * @param key
     * @param orderNo 주문번호, Length 9
     */
    public getShippingAndClaimInfoByOrderNo_V2 = async (key: string, orderNo: string) => {
        const config = Builder<IAxios>()
            .method('get')
            .url(qoo10DefaultUri)
            .params(setQoo10Params({
                method: 'ShippingBasic.GetShippingAndClaimInfoByOrderNo_V2',
                OrderNo: orderNo,
                key,
            }))
            .build();

        return await Axios.setConfig(config).send();
    };

    /**
     *
     * @param key
     * @param claimStat
     * @param search_Sdate
     * @param search_Edate
     * @param search_condition
     */
    public getClaimInfo_V3 = async (key: string, claimStat: string, search_Sdate: string, search_Edate: string, search_condition: string) => {
        const config = Builder<IAxios>()
            .method('get')
            .url(qoo10DefaultUri)
            .params(setQoo10Params({
                method: 'ShippingBasic.GetClaimInfo_V3',
                ClaimStat: claimStat,
                search_Sdate: search_Sdate,
                search_Edate: search_Edate,
                search_condition: search_condition,
                key,
            }))
            .build();

        return await Axios.setConfig(config).send();
    };

    /* 공통 정보 조회 */

    /**
     * 모든 카테고리를 조회
     * @param key
     * @param lang_cd 언어 코드
     */
    public getCatagoryListAll = async (key: string, lang_cd: string) => {
        const config = Builder<IAxios>()
            .method('get')
            .url(qoo10DefaultUri)
            .params(setQoo10Params({
                method: 'CommonInfoLookup.GetCatagoryListAll',
                lang_cd: lang_cd,
                key,
            }))
            .build();

        return await Axios.setConfig(config).send();
    };

    /**
     * 메이커를 검색
     * @param key
     * @param keyword 검색 키워드, Length Max 50
     */
    public searchMaker = async (key: string, keyword: string) => {
        const config = Builder<IAxios>()
            .method('get')
            .url(qoo10DefaultUri)
            .params(setQoo10Params({
                method: 'CommonInfoLookup.SearchMaker',
                keyword: keyword,
                key,
            }))
            .build();

        return await Axios.setConfig(config).send();
    };

    /**
     * 브랜드를 검색
     * @param key
     * @param keyword 검색 키워드, Length Max 50
     */
    public searchBrand = async (key: string, keyword: string) => {
        const config = Builder<IAxios>()
            .method('get')
            .url(qoo10DefaultUri)
            .params(setQoo10Params({
                method: 'CommonInfoLookup.SearchBrand',
                keyword: keyword,
                key,
            }))
            .build();

        return await Axios.setConfig(config).send();
    };
}
