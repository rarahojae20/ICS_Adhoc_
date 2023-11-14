import { IShipper } from "../../../types/shipper";
import ShipperRepository from "./shipper.repository";

export default class ShipperService {


public create = async(param: IShipper): Promise<IShipper> => {
    return await new ShipperRepository().create(param);
};

}