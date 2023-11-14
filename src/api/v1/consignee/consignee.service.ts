import { IConsignee } from "../../../types/consignee";
import ConsigneeRepository from "./consignee.repository";

export default class ConsigneeService {

    public create = async(param: IConsignee): Promise<IConsignee> => {
        return await new ConsigneeRepository().create(param);
	};
}
