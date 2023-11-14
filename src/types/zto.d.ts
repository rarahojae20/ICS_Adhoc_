export interface IZtoDelivery {
  logisticsId?: string | null;
  orderId: string;
  shipper: string;
  shipperProv: string;
  shipperCity: string;
  shipperDistrict: string;
  shipperAddress: string;
  shipperMobile?: string;
  shipperTelephone?: string;
  shipperCountry: string;
  shipperZipcode?: string | null;
  consignee: string;
  consigneeProv: string;
  consigneeCity: string;
  consigneeDistrict: string;
  consigneeAddress: string;
  consigneeMobile: string;
  consigneeTelephone: string;
  consigneeCountry: string;
  consigneeZipCode?: string;
  idType: string;
  customerId: string;
  shippingFee?: number;
  shippingFeeUnit?: string;
  weight: string;
  ieType: string;
  stockFlag: string;
  customsCode?: string;
  platformSource: string;
  sortContent?: string;
  needBigMark: number;
  netWeight: string;
  shipType: string;
  warehouseCode: string;
  totalLogisticsNo?: string;
  flightCode?: string;
  userId?: string;
  remark?: string;
  billEntity: IZtoBillEntity;
  intlOrderItemList: IZtoIntlOrderItem[];
}

export interface IZtoBillEntity {
  batchNumbers?: string;
  quantity: string;
  ecpCode: string;
  ecpName: string;
  ecpCodeG?: string;
  ecpNameG?: string;
  wrapType: string;
  companyCode?: string;
}

export interface IZtoIntlOrderItem {
  itemId: string;
  itemName: string;
  itemUnitPrice: string;
  itemQuantity: number;
  itemRemark?: string;
  dutyMoney?: number
  blInsure?: number ;
  length?: number;
  width?: number;
  high?: number;
  itemMaterial?:String;
  itemWeight?: number;
  currencyType:	String;
  itemRule?:	String;
  makeCountry?:	String
  itemUnit: String;
}
