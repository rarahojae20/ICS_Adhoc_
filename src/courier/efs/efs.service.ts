import { Courier } from '..';
import { env } from '../../env';
import logger from '../../lib/logger';
import Axios from '../../lib/axios';
import { IAxios } from '../../types/axios';
import { Builder } from 'builder-pattern';
import crypto from 'crypto';
import { IEfsDelivery } from '../../../src/types/efs';
import { enc } from 'crypto-js';

export default class EfsService extends Courier {
    public track(tracking_no: string): Promise<any> {
        // TBU
        return null;
    }

    public async newCreateShipment(delivery): Promise<any> {
        const requestData = this.newRequestData(delivery);
        const encryptedData = this.encryptData(requestData); // 암호화 추가
        // const signData2 = this.signData(requestData,env.courier.efs.secret)


        const config = Builder<IAxios>()
            .url(`asdsvja/v1/shipments`)
            .method('POST')
            .headers({
                'Content-Type': 'application/json',
            })
            .data({
                'apikey': `${env.courier.efs.apikey}`,
                'req_function': 'newCreateShipment',
                'send_data': encryptedData,
            })
            .build();

        logger.debug(`config : ${JSON.stringify(config)}`);

        const data = await Axios.setConfig(config).send();
        return data;
    }

    private newRequestData(data: any): string {
        // const shopInfoString = encodeURIComponent(`{${Object.values(data.ShopInfo).join(',')}}`.toString());
        const shopInfoString = `{${Object.values(data.ShopInfo).join(',')}}`.toString();

        const sendDataField = Object.entries(data)
            .map(([key, value]) => {
                if (key === 'ShopInfo') {
                    return shopInfoString;
                }
                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                    return value.toString();
                } else {
                    return '';
                }
            });
            const send_data = '|' + sendDataField.join('|'); // 처음에도 | 추가
            
            const encodedData= encodeURIComponent(send_data.toString());
            console.log(encodedData)
            
        // return send_data
        return encodedData;
    }

    private encryptData(data: string): string {
        const secretKey = env.courier.efs.secret;
        const algorithm = 'aes-256-cbc';
        const iv = Buffer.alloc(16, 0);
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
        let encryptedData = cipher.update(data, 'utf8', 'base64');
        encryptedData += cipher.final('base64');

        console.log()
        return encryptedData;
    }

    // private signData(data: string, secret: string): string {
    //     // Secret Key를 사용하여 데이터에 서명 생성
    //     const signature = crypto.createHmac('sha256', secret).update(data).digest('hex');
    //     return signature;
    // }

}

