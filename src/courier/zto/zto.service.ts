import { Courier } from "..";
import { env } from "../../env";
import crypto from 'crypto';
import axios from "axios";
import { time } from "console";
import { IZtoDelivery } from "../../../src/types/zto";
import { Builder } from "builder-pattern";
export default class ZTOService extends Courier {
    public track(tracking_no: string): Promise<any> {
        // TBU
        return null;
    }

    public async createShipment(delivery: IZtoDelivery): Promise<any> {
        const secretKey = '7r*cQSA#';
        const timestamp = new Date().getTime();
        const formedDelivery = this.setDeliverParam(delivery);
        const plainText = JSON.stringify(formedDelivery);

        const body = {
            data: plainText,
            sign: this.encrypt(timestamp, secretKey, plainText),
        };

        const iv = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xAB, 0xCD, 0xEF]);
        const algorithm = 'des-cbc';
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

		let encryptedData = cipher.update(JSON.stringify(body), 'utf8', 'base64');
		encryptedData += cipher.final('base64');

        const url = `?method=addBcImportOrder&timestamp=${timestamp}&appCode=10661`;
        
        const ztoServer = axios.create({
            baseURL: env.courier.zto.url,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': encryptedData.length,
            }
        });

        const result = await ztoServer.post(url, encryptedData)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error.response;
        });

        return result;
    }

    private encrypt = (timestamp, secret, jsonData) => {
        const data = `${timestamp}${secret}${jsonData}`;
        const md5Hash = crypto.createHash('md5').update(data).digest('hex');
        return md5Hash;
    }

    private setDeliverParam = (delivery: IZtoDelivery) => {
        const formedDelivery = Builder<IZtoDelivery>()
        .logisticsId(delivery.logisticsId)
        .orderId(delivery.orderId)
        .shipper(delivery.shipper)
        .shipperProv(delivery.shipperProv)
        .shipperCity(delivery.shipperCity)
        .shipperDistrict(delivery.shipperDistrict)
        .shipperAddress(delivery.shipperAddress)
        .shipperMobile(delivery.shipperMobile)
        .shipperTelephone(delivery.shipperTelephone)
        .shipperCountry(delivery.shipperCountry)
        .shipperZipcode(delivery.shipperZipcode)
        .consignee(delivery.consignee)
        .consigneeProv(delivery.consigneeProv)
        .consigneeCity(delivery.consigneeCity)
        .consigneeDistrict(delivery.consigneeDistrict)
        .consigneeAddress(delivery.consigneeAddress)
        .consigneeMobile(delivery.consigneeMobile)
        .consigneeTelephone(delivery.consigneeTelephone)
        .consigneeCountry(delivery.consigneeCountry)
        .consigneeZipCode(delivery.consigneeZipCode)
        .idType(delivery.idType)
        .customerId(delivery.customerId)
        .shippingFee(delivery.shippingFee)
        .shippingFeeUnit(delivery.shippingFeeUnit)
        .weight(delivery.weight)
        .ieType(delivery.ieType)
        .stockFlag(delivery.stockFlag)
        .customsCode(delivery.customsCode)
        .platformSource(delivery.platformSource)
        .sortContent(delivery.sortContent)
        .needBigMark(delivery.needBigMark)
        .netWeight(delivery.netWeight)
        .shipType(delivery.shipType)
        .warehouseCode(delivery.warehouseCode)
        .totalLogisticsNo(delivery.totalLogisticsNo)
        .flightCode(delivery.flightCode)
        .userId(delivery.userId)
        .remark(delivery.remark)
        .billEntity(delivery.billEntity)
        .intlOrderItemList(delivery.intlOrderItemList)
        .build();
        return formedDelivery;
    }

}
