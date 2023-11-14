const TrackingStatus = Object.freeze({

    DELIVERY_START: 'delivery_start',// 배송시작
    DELIVERY_IN_PROGRESS: 'shipping',// 배송중
    DELIVERY_FINISH: 'delivered',// 배송완료

    BOUNCE: 'bouncing',// 반송
    BOUNCE_COMPLETE: 'bounced',// 반송완료
    CUSTOMER_BOUNCE_COMPLETE: 'bounced_customer',// 고객사반송완료

    ADDRESS_ERROR: 'invalid_addr',// 주소오류
    REFUSED_RECEIPT: 'delivery_refused',// 수취거절
    DELIVERY_CANCELLED: 'delivery_canceled',// 배송취소
    DELIVERY_FAILURE: 'delivery_failure',// 배달실패
    DISPOSAL: 'disposal',// 폐기
    LOST_OR_DAMAGED: 'lost_damaged',// 상품분실/파손

    DIRECT_RECEIPT: 'direct_receipt',// 수취인직접수령
    RETURN: 'returning',// 반품
    RETURN_COMPLETE: 'returned',// 반품완료
    CUSTOMER_RETURN_PRODUCT_COMPLETE: 'returned_customer',// 고객사반품완료
});
export default TrackingStatus;
