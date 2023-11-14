/* eslint-disable @typescript-eslint/no-explicit-any */
import { Builder } from 'builder-pattern';
import { env } from '../../../env';
import { IAxios } from '../../../types/axios';
import Axios from '../../../lib/axios';
import ExportRepository from './exp.repository';
import { PaginationVo } from '../../../common/vo/pagination.vo';

export default class ExportService {
    public checkExports = async(invoiceList: string[], param: PaginationVo) => {
        const invoiceCnt = invoiceList?.length;
        let invcList;

        if (!invoiceCnt) {
            const storedInvcList = await new ExportRepository().getInvcList();
            invcList = storedInvcList?.map((item) => {
                return {
                    invcNo: item.invoice_no,
                };
            });
        } else {
            invcList = invoiceList?.map((invoiceNo) => {
                return {
                    invcNo: invoiceNo,
                };
            });
        }

        const config = Builder<IAxios>()
        .method('post')
        .url(`${env.agente.url.export.check}`)
        .headers({
            'Content-Type': 'application/json',
            'agente-service-key': env.agente.service.key,
        })
        .data({
            header: {
                numOfReqHawbs: invoiceCnt,
            },
            invcList
        })
        .build();

        const result = await Axios.setConfig(config).send();
        result.invcResultList = result?.invcResultList?.slice((param?.page - 1) * param?.size, param?.size);
        return result;
    };

    public registerExports = async(data: any) => {
        const config = Builder<IAxios>()
        .method('post')
        .url(`${env.agente.url.export.register}`)
        .headers({
            'Content-Type': 'application/json',
            'agente-service-key': env.agente.service.key,
        })
        .data(data)
        .build();

        const result = await Axios.setConfig(config).send();

        for (const item of result?.invcResultList) {
            if (item?.responseCode === "00") { // response 성공 시 invcNo 저장
                const param = {
                    invoice_no: item?.invcNo,
                    agente_no: item?.agenteNo,
                    com_id: item?.comId
                }
                await new ExportRepository().register(param);
            }
        }

        return result;
    };

    public checkSimplifiedExports = async(orderList: string[], param: PaginationVo) => {
        const orderCnt = orderList?.length;
        let invcList;

        if (!orderCnt) {
            const storedOrderList = await new ExportRepository().getOrderList();
            invcList = storedOrderList?.map((item) => {
                return {
                    ordNo: item.order_no,
                }
            });
        } else {
            invcList = orderList?.map((ordNo) => {
                return { ordNo };
            });
        }


        const config = Builder<IAxios>()
        .method('post')
        .url(`${env.agente.url.simplifiedExport.check}`)
        .headers({
            'Content-Type': 'application/json',
            'agente-service-key': env.agente.service.key,
        })
        .data({
            header: {
                numOfReqHawbs: orderCnt,
            },
            invcList
        })
        .build();

        const result = await Axios.setConfig(config).send();
        result.invcResultList = result?.invcResultList?.slice((param?.page - 1) * param?.size, param?.size);
        return result;
    };


    public registerSimplifiedExports = async(data: any) => {
        const config = Builder<IAxios>()
        .method('post')
        .url(`${env.agente.url.simplifiedExport.register}`)
        .headers({
            'Content-Type': 'application/json',
            'agente-service-key': env.agente.service.key,
        })
        .data(data)
        .build();

        const result = await Axios.setConfig(config).send();

        for (const item of result?.invcResultList) {
            if (item?.responseCode === "00") { // response 성공 시 ordNo 저장
                const param = {
                    order_no: item?.ordNo,
                    agente_no: item?.agenteNo,
                    com_id: item?.comId
                }
                await new ExportRepository().register(param);
            }
        }

        return result;
    };
}
