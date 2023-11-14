import { JP_Address } from '../../../models/jp_address.model';
import { IJP_Address } from '../../../types/jp_address';
import { mysql } from '../../../lib/mysql';
import logger from '../../../lib/logger';

export default class AddrRepository {
    public async removeAndCreateAddress(addressList: IJP_Address[], agency: string) {
        const transaction = await mysql.transaction();

        try {
            await JP_Address.destroy({
                where: { agency },
                transaction
            });

            await JP_Address.bulkCreate(addressList, {
                transaction
            });

            await transaction.commit();
            logger.log(`JP Address updated successfully. Agency: ${agency}`);
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
            throw e;
        }
    }

}
