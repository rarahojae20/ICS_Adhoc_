import { Router } from 'express';
import AddrController from './addr.controller';
import MiddleWare from '../../../lib/middleware';

export const router = Router();
export const path = '/addr';

router.get('/verify/:country_code', new AddrController().verifyAddress);
router.put('/jp', new MiddleWare().uploadAddressFile.single('address'), new AddrController().updateJPAddress);
