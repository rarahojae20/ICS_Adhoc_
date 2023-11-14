/* eslint-disable @typescript-eslint/no-explicit-any */
import { Builder } from 'builder-pattern'

import Marketplace from '..';
import Qoo10ApiReader from "./qoo10.api.reader";
import ItemService from '../../api/v1/item/item.service';
import OrderService from '../../api/v1/order/order.service';

import { env } from '../../env';

import logger from "../../lib/logger";
import { getOrderDate } from '../../lib/utils';
import Axios from '../../lib/axios';

import { IAxios } from '../../types/axios';

import { AdhocItem } from '../../types/item';
import { AdhocOrder } from '../../types/order';

import { ISeller } from '../../types/core/seller';
import { IShipment } from '../../types/core/shipment';

import { IItem } from '../../types/core/item';
import { IContact } from '../../types/core/contact';
import { IPrice } from '../../types/core/price';
import { IProduct } from '../../types/core/product'
import { IBrand } from '../../types/core/brand';
import { IManufacturer } from '../../types/core/manufacturer';
import { ICategory } from '../../types/core/category';
import { IMedia } from '../../types/core/media';

import { IOrder } from '../../types/core/order';
import { IPayment } from '../../types/core/payment';
import { ICart } from '../../types/core/cart';
import { IDiscount } from '../../types/core/discount';
import { ISender } from '../../types/core/sender';
import { IPurchaser } from '../../types/core/purchaser';
import { IRecipient } from '../../types/core/recipient';
import { IConsignment } from '../../types/core/consignment';
import { IOption } from '../../types/core/option';

export default class Qoo10Service extends Marketplace {
    constructor(size = 10) {
        super(size);
    }

	public updateItem = async(dataSource: string, targetHost?: string): Promise<number> => {
        if (dataSource === 'remote') await this.getItemsFromMarketplace(); // qoo10에서 상품 정보를 가져오고 mysql에 넣음
        const { rows, count } = await new ItemService().list({ // mysql에서 상품 정보를 가져옴
            marketplace: 'qoo10'
        });
        const result = await this.uploadItemData(rows, targetHost); // core에 상품 정보를 가공해서 넣음
        logger.debug('result:', result);

        return count;
	};

	public updateOrder = async(dataSource: string, targetHost?: string): Promise<number> => {
        if (dataSource === 'remote') await this.getOrdersFromMarketplace(); // qoo10에서 주문 정보를 가져오고 mysql에 넣음
        const { rows, count } = await new OrderService().list({ // mysql에서 주문 정보를 가져옴
            marketplace: 'qoo10'
        });
        const result = await this.uploadOrderData(rows, targetHost); // core에 주문 정보를 가공해서 넣음
        logger.debug('result:', result);

        return count;
	};

    /**
	 * S0 - 검수대기 *
	 * S1 - 거래대기 *
	 * S2 - 거래가능 *
	 * S3 - 거래중지
	 * S4 - 거래폐지
	 * S5 - 제한상품
	 * getAllGoodsInfo를 S0, S1, S2에 대해서만 가져오기 가능
	 */
    protected getItemsFromMarketplace = async(): Promise<void> => {
        const now = new Date();
        const details = [];
        const statusList = ['S0', 'S1', 'S2'];

        for (const status of statusList) {
            // 이거는 순차처리하기 (그래야 로깅남기고 실패 시 처리가 편할듯)
            logger.debug('Item Status:', status);

            // 해당 API의 마지막 인자인 '1'은 페이지이며, 1이 없을 경우 넘어가고 1이상일 경우 여러번 호출을 해야 함.
            const result = await new Qoo10ApiReader().getAllGoodsInfo(env.shopping.qoo10.api.key, status, '1');
            if (result?.ResultObject?.TotalItems === 0) continue; // api 호출은 성공했으나 비어있을때 건너뛰기

            if (result?.ResultCode === 0) { // 첫 api 호출 성공 시
                const items = [];
                items.push(...result.ResultObject.Items);

                if (result?.ResultObject?.TotalPages > 1) {
                    for (let idx = 2; idx <= result.ResultObject.TotalPages; idx++) {
                        const goods = await new Qoo10ApiReader().getAllGoodsInfo(env.shopping.qoo10.api.key, status, `${idx}`);
                        if (goods?.ResultCode === 0 && result?.ResultObject?.TotalItems > 0) items.push(...goods.ResultObject.Items);
                    }
                }

                // 각 아이템들 상세정보 불러오기
                await Promise.all(
                    items.map(async (item) => {
                        const detailResponse = await new Qoo10ApiReader().getItemDetailInfo(env.shopping.qoo10.api.key, item.ItemCode, item.SellerCode);
                        if (detailResponse?.ResultCode !== 0) { // throw error 시 진행중이던 작업이 멈추므로 로깅만 남겨서 확인하기로함. 추후 알림을 보내는 방식도 추가하면 좋을 듯.
                            logger.error(`Item information invalid. ItemCode:${item.ItemCode}/SellerCode:${item.SellerCode}/Status:${status}`);
                        } else {
                            details.push(...detailResponse.ResultObject);
                        }
                    })
                );

                logger.debug('itemDetails:', details);

                /**
                 * 업데이트된 아이템들을 db에 업데이트
                 * 없을 경우 추가
                 */
                await Promise.all(
                    details.map(async (obj) => {
                        const param = Builder<AdhocItem>()
                            .item_no(obj.ItemNo)
                            .seller_code(obj.SellerCode)
                            .marketplace('qoo10')
                            .payload(obj)
                            .updated_at(now)
                            .build();

                        await new ItemService().upsertItem(param);
                    })
                );
            }
            logger.debug(`scheduler updated at ${new Date()}`);
        }
    };

    /**
     * 1: 배송대기, 2: 배송요청, 3: 배송준비, 4: 배송중, 5: 배송완료
     * 주문의 상태를 추적해야 하기 때문에 전부 가져와야 함.
     */
    protected getOrdersFromMarketplace = async(): Promise<void> => {
        const now = new Date();
        const deliveryStatusList = ['1', '2', '3', '4', '5'];
        const { startDay, endDay } = await getOrderDate();

        for (const deliveryStatus of deliveryStatusList) {
            logger.debug('Delivery Status:', deliveryStatus);

            // 결제가 된 상품에 대해서만 정보를 가져와야 함.
            const result = await new Qoo10ApiReader().getShippingInfo_v2(env.shopping.qoo10.api.key, deliveryStatus, startDay, endDay, '2');
            if (result?.ResultObject?.length === 0) continue; // api 호출은 성공했으나 비어있을때 건너뛰기
            if (result?.ResultCode === 0) { // api 호출 성공 시
                logger.debug('orderDetails:', result.ResultObject);
                await Promise.all(
                    result.ResultObject.map(async(order) => {
                        const param = Builder<AdhocOrder>()
                            .order_no(order.orderNo)
                            .marketplace('qoo10')
                            .seller_name(order.sellerID)
                            .payload(order)
                            .updated_at(now)
                            .build();

                        await new OrderService().upsertOrder(param);
                    })
                );
            }
        }
        logger.debug(`scheduler updated at ${new Date()}`);
    };

    protected uploadItemData = async(params: any[], targetHost: string) => {
        const result = [];

        const seller = {
            id: env.shopping.qoo10.user,
            store: 'qoo10'
        };
        const items = await this.setItemParam(params);
        logger.debug(`scheduler created at ok ${new Date()}`);

        for (const item of items) {
            const config = Builder<IAxios>()
                .headers({
                    'x-debug-response-error-level': 'verbose'
                })
                .method('post')
                .url(targetHost || env.core.api.item)
                .data({
                    seller,
                    items: item
                })
                .build();

            result.push(await Axios.setConfig(config).send());
        }

        logger.debug('items payload seller, items:', {
            seller,
            items
        });

        return result;
    };

    protected uploadOrderData = async(params: any[], targetHost: string) => {
        const result = [];

        const seller = {
            id: env.shopping.qoo10.user,
            store: 'qoo10'
        };
        const orders = await this.setOrderParam(params);
        logger.debug(`scheduler created at ok ${new Date()}`);

        for (const order of orders) {
            const config = Builder<IAxios>()
                .headers({
                    'x-debug-response-error-level': 'verbose'
                })
                .method('post')
                .url(targetHost || env.core.api.order)
                .data({
                    seller,
                    orders: order
                })
                .build();

            result.push(await Axios.setConfig(config).send());
        }

        logger.debug('order payload seller, orders:', {
            seller,
            orders
        });

        return result;
    };

    protected setItemParam = async(params: any[]) => {
        const items = [];

        for (let page = 0; page < Math.ceil(params.length / this.size); page++) {
            const tmp = [];
            const start = page * this.size;
            const end = (page * this.size) + this.size > params.length ? params.length : (page * this.size) + this.size;

            params.slice(start, end).forEach(param => {
                const category = [];
                category.push(Builder<ICategory>()
                    .code(param.payload.MainCatCd)
                    .name(param.payload.MainCatNm)
                    .build());
                category.push(Builder<ICategory>()
                    .code(param.payload.FirstSubCatCd)
                    .name(param.payload.FirstSubCatNm)
                    .build());
                category.push(Builder<ICategory>()
                    .code(param.payload.SecondSubCatCd)
                    .name(param.payload.SecondSubCatNm)
                    .build());

                const product = Builder<IProduct>()
                    .state(param.payload.ItemStatus)
                    .name(param.payload.ItemTitle)
                    .industrial_code(param.payload.IndustrialCode)
                    .adult(param.payload.AdultYN)
                    .brand(Builder<IBrand>()
                        .code(param.payload.BrandCd)
                        .name(param.payload.BrandNm)
                        .build())
                    .manufacturer(Builder<IManufacturer>()
                        .code(param.payload.ManufacturerCd)
                        .name(param.payload.ManufacturerNm)
                        .build())
                    .category(category)
                    .media(Builder<IMedia>()
                        .thumbnail(param.payload.ImageUrl)
                        .build())
                    .detail(param.payload.ItemDetail)
                    .build();

                const price = Builder<IPrice>()
                    .currency('JPY')
                    .sell(param.payload.SellPrice)
                    .retail(param.payload.RetailPrice)
                    .settle(param.payload.SettlePrice)
                    .build();

                const item = Builder<IItem>()
                    .no(param.payload.ItemNo)
                    .quantity(param.payload.ItemQty)
                    .state(param.payload.ItemStatus)
                    .seller(Builder<ISeller>()
                        .item_code(param.payload.SellerCode)
                        .build())
                    .shipment(Builder<IShipment>()
                        .code(param.payload.ShippingNo)
                        .build())
                    .contact(Builder<IContact>()
                        .tel(param.payload.ContactTel)
                        .build())
                    .product(product)
                    .price(price)
                    .listed_at(new Date(param.payload.ListedDate))
                    .changed_at(new Date(param.payload.ChangedDate))
                    .expired_at(new Date(param.payload.ExpireDate))
                    .build();

                tmp.push(item);
            });
            items.push(tmp);
        }

        return items;
    };

    protected setOrderParam = async(params: any[]) => {
        const orders = [];

        for (let page = 0; page < Math.ceil(params.length / this.size); page++) {
            const tmp = [];
            const start = page * this.size;
            const end = (page * this.size) + this.size > params.length ? params.length : (page * this.size) + this.size;

            params.slice(start, end).forEach(param => {
                const order = Builder<IOrder>()
                    .waybill_no(param.payload.TrackingNo)
                    .no(param.payload.orderNo)
                    .type(param.payload.OrderType)
                    .quantity(param.payload.orderQty)
                    .packing_no(param.payload.PackingNo)
                    .tracking_no(param.payload.TrackingNo)
                    .item_no(param.payload.itemCode)
                    .item_name(param.payload.itemTitle)
                    .seller(Builder<ISeller>()
                        .item_code(param.payload.sellerItemCode)
                        .delivery_no(param.payload.SellerDeliveryNo)
                        .discount(param.payload.SellerDiscount)
                        .build())
                    .shipment(Builder<IShipment>()
                        .country(param.payload.shippingCountry)
                        .carrier(param.payload.DeliveryCompany)
                        .state(param.payload.shippingStatus)
                        .rate(param.payload.ShippingRate)
                        .est_shipping_at(new Date(param.payload.EstShippingDate))
                        .shipping_at(new Date(param.payload.ShippingDate))
                        .delivered_at(new Date(param.payload.DeliveredDate))
                        .build())
                    .payment(Builder<IPayment>()
                        .currency(param.payload.Currency)
                        .price(param.payload.orderPrice)
                        .discount(param.payload.discount)
                        .total(param.payload.total)
                        .method(param.payload.PaymentMethod)
                        .payment_at(new Date(param.payload.PaymentDate))
                        .build())
                    .cart(Builder<ICart>()
                        .no(param.payload.packNo)
                        .discount(Builder<IDiscount>()
                            .seller(param.payload.Cart_Discount_Seller)
                            .qoo10(param.payload.Cart_Discount_Qoo10)
                            .build())
                        .build())
                    .sender(Builder<ISender>()
                        .type(param.payload.OrderType)
                        .country(param.payload.senderNation)
                        .name1(param.payload.senderName)
                        .name2(param.payload.senderName)
                        .phone(param.payload.senderTel)
                        .mobile(param.payload.senderTel)
                        .zip(param.payload.senderZipCode)
                        .addr1(param.payload.senderAddr)
                        .addr2(param.payload.senderAddr)
                        .build())
                    .purchaser(Builder<IPurchaser>()
                        .country(param.payload.PaymentNation)
                        .name(param.payload.buyer)
                        .name_gata(param.payload.buyer_gata)
                        .phone(param.payload.buyerTel)
                        .mobile(param.payload.buyerMobile)
                        .email(param.payload.buyerEmail)
                        .build())
                    .recipient(Builder<IRecipient>()
                        .type(param.payload.OrderType)
                        .country(param.payload.shippingCountry)
                        .name1(param.payload.receiver)
                        .name2(param.payload.receiver_gata)
                        .phone(param.payload.receiverTel)
                        .mobile(param.payload.receiverMobile)
                        .zip(param.payload.zipCode)
                        .addr1(param.payload.Addr1)
                        .addr2(param.payload.Addr2)
                        .build())
                    .consignment(Builder<IConsignment>()
                        .country(param.payload.OverseaConsignment_Country)
                        .phone('')
                        .mobile('')
                        .zip(param.payload.OverseaConsignment_zipCode)
                        .addr1(param.payload.OverseaConsignment_Addr1)
                        .addr2(param.payload.OverseaConsignment_Addr2)
                        .build())
                    .ordered_at(new Date(param.payload.orderDate))
                    .option(Builder<IOption>()
                        .value(param.payload.option)
                        .code(param.payload.optionCode)
                        .build())
                    .build();

                tmp.push(order);
            });
            orders.push(tmp);
        }

        return orders;
    };

    // adhoc에서 카테고리를 관리할 이유가 없음.
    public getCatagoryList = async() => {
        return await new Qoo10ApiReader().getCatagoryListAll(env.shopping.qoo10.api.key, 'ko');
    };
}
