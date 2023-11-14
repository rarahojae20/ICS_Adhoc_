import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { Result } from '../../../common/result';
import logger from '../../../lib/logger';
import DeliveryService from './delivery.service';

export default class DeliveryController {

  public create = async (req: Request, res: Response) => {
    try {
      const deliveryData = req.body;
      const courier = req.params.courier.toLowerCase();
      
      
      let result;

      try {
        const newDelivery = await new DeliveryService().create(deliveryData, courier);
        result = Result.ok<string>(newDelivery).toJson();

        // logger.log(`result : ${JSON.stringify(result)}`);
      } catch (e: any) {
        logger.err(JSON.stringify(e));
        logger.error(e);

        result = Result.fail<Error>(e).toJson();
      }
      logger.res(httpStatus.OK, result, req);
      res.status(httpStatus.OK).json(result);
    } catch (error) { 
     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
  }
}
