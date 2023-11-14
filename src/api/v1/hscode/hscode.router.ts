import { Router } from 'express';

import HscodeController from './hscode.controller';


export const path = '/hscodes';
export const router = Router();

router.get('/', new HscodeController().list); // 류, 호, 소호 검색
router.get('/:hscode/taxs', new HscodeController().getTaxs);
router.put('/:hscode/keywords', new HscodeController().updateKeyword); // 키워드 수정
