import { Router } from 'express';
import httpStatus from 'http-status';

import * as v1 from './api/v1/v1.router';

import ApiMessages from './lib/api.messages';

export const router = Router();
export const path = '';

/**
 * API version에 독립적인 Route path
 */
router.get('/healthCheck', function (req, res) {
    res.set('Content-Type', 'text/plain')
    res.status(httpStatus.OK).send('');
});

router.get('/health', function (req, res) {
    res.set('Content-Type', 'text/plain')
    res.status(httpStatus.OK).send('');
});

/* API v1 */
router.use(v1.path, v1.router);
