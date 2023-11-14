import { Router } from 'express';
import AuthMiddleware from '../../v1/auth/auth.middleware';

import EmailController from './email.controller';

export const path = '/emails';
export const router = Router();

router.get('/', new AuthMiddleware().verifyUserAuth, new EmailController().getEmails);
router.post('/', new EmailController().sendEmail);
