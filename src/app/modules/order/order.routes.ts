import express from 'express';
import orderControllers from './order.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { zodOrder } from './order.validation';

const router = express.Router();

router.post(
	'/',
	validateRequest(zodOrder.creationSchema),
	orderControllers.createOrder,
);
router.get('/revenue', orderControllers.getOrderRevenue);

export const orderRoutes = router;
