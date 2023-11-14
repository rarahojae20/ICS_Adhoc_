export interface IYtoDelivery {
    orderId: string;
    channelHawbcode?: string;
    declareType: string;
    orderInvoices: IYtoOrderInvoice[];
    consignee: IYtoUser;
    shipper: IYtoUser;
    orderExtraServices?: IYtoExtraServices[];
    transportModeCode: string;
    weight?: number;
    weightUnit?: string;
    piece?: number;
    remark?: string;
}

export interface IYtoUser {
    name: string;
    company?: string;
    countryCode: string;
    provinceName?: string;
    cityName?: string;
    address: string;
    postCode?: string;
    areaName?: string;
    mobile: string;
    phone?: string;
    email?: string;
    certificateType?: string;
    certificateNumber?: string;
}

export interface IYtoOrderInvoice {
    sku?: string;
    ename: string;
    cname: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    currencyCode: string;
    specification?: string;
    customsOrdinationNo?: string;
    remark?: string;
    saleAddr?: string;
    // currencyName?: string;
}

export interface IYtoExtraServices {
    code?: string;
    value?: string;
    remark?: string;
    currencyCode?: string; 
}
