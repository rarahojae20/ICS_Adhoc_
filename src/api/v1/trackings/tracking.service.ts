/* eslint-disable @typescript-eslint/no-explicit-any */
import TrackingRepository from './tracking.repository';
import { Tracking } from "../../../models/tracking.model";
import { ITracking } from "../../../types/core/tracking";

export default class TrackingService {

    public create = async (param: ITracking): Promise<Tracking> => {
        const tracking = await new TrackingRepository().findOne(param);
        if (!tracking) {
            return await new TrackingRepository().create(param);
        }
        return tracking;
    };
}
