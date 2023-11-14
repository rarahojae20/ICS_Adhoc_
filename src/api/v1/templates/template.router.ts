import { Router } from 'express';

import TemplateController from './template.controller';

export const path = '/templates';
export const router = Router();
//앱경로 설정 /v1/template

router.get('/', new TemplateController().list); //v1/template 로 get요청을 받으면 조회하는 API 실행 
router.post('/', new TemplateController().create); //v1/template 로 post요청을 받으면 생성하는 API 실행