import logger from '../../lib/logger';
import RakutenApiReader from './rakuten.api.reader';

export default class RakutenService {
    async getItem() {
        const result = await new RakutenApiReader().getItem();

        logger.log(result);
        return result;
    }

    async searchItems() {
        const result = await new RakutenApiReader().searchItems();

        logger.log(result);
        return result;
    }

    async searchOrders() {
        const result = await new RakutenApiReader().searchOrders();

        logger.log(result);
        return result;
    }

    async getOrders() {
        const result = await new RakutenApiReader().getOrders();

        logger.log(result);
        return result;
    }
    async confirmOrders() {
        const result = await new RakutenApiReader().confirmOrders();

        logger.log(result);
        return result;
    }

    async searchProduct() {
        const result = await new RakutenApiReader().searchProduct();

        logger.log(result);
        return result;
    }

    async updateOrderShipping() {
        // 테스트 단계에서는 사용X
    }

    async updateOrderShippingAsync() {
        // 테스트 단계에서는 사용X
    }

    async getResultUpdateOrderShippingAsync() {
        // 테스트 단계에서는 사용X
    }
}
