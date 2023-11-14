import { Router } from 'express';
import WaybillController from "./waybill.controller";

export const path = '/waybills';
export const router = Router();

router.post('/', new WaybillController().create);
