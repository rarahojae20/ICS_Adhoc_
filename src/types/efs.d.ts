export interface IEfsDelivery {
  ShprRefNo: string; // 필수
  ReferenceNumber?: string;
  ServiceType: string; // 필수
  ShipperName: string; // 필수
  ShipperAddress: string; // 필수
  ShipperZipCode: string; // 필수
  ShipperPhoneNumber: string; // 필수
  ShipperMobileNumber?: string;
  ShipperCountryCode: string; // 필수
  ShipperCityCode: string; // 필수
  ConsigneeName: string; // 필수
  ConsigneeAddress1: string; // 필수
  ConsigneeAddress2?: string;
  ConsigneeAddress3?: string;
  ConsigneeZipCode: string; // 필수
  ConsigneePhoneNumber: string; // 필수
  ConsigneeMobileNumber?: string;
  ConsigneeCountryCode: string; // 필수
  ConsigneeCity: string; // 필수
  ShoppingMallName?: string;
  CartNo?: string;
  OrderNo?: string;
  ItemCode?: string;
  ItemDescription: string; // 필수
  ItemCategory: string; // 필수
  ItemOption: string; // 필수
  ItemOptionKor: string; // 필수
  ItemQuantity: number; // 필수
  Currency: string; // 필수
  ItemValue: number; // 필수
  TotalWeight: number; // 필수
  DeclarationPrice: number; // 필수
  ShippingCost: number; // 필수
  ShipmentByShip?: string;
  WeightInfo?: string;
  ExportNumber?: string;
  RegistrationNumber?: string;
}
