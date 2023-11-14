import { Router } from 'express';
import DeliveryController from './delivery.controller';

export const path = '/deliveries';
export const router = Router();

router.post('/:courier', new DeliveryController().create); //yto

