import { IOrderInvoice } from "../../../types/Invoice";
import OrderInvoiceRepository from "./orderinvoice.repository";


export default class OrderInvoiceService {

    public create = async(param: IOrderInvoice): Promise<IOrderInvoice> => {
        return await new OrderInvoiceRepository().create(param);
	};
}
