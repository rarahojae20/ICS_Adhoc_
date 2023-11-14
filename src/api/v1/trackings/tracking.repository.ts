/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tracking } from '../../../models/tracking.model';
import { ITracking } from '../../../types/core/tracking';

export default class TrackingRepository {

    public findOne = async (attr: ITracking) : Promise<Tracking> => {
        return await Tracking.findOne({
            where: { ...attr },
        });
    };

    public create = async (attr: ITracking): Promise<Tracking> => {
        return await Tracking.create(attr);
    };
}
