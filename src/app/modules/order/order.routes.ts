import express from 'express';
import authorizeUser from '../../middlewares/authorizeUser';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../user/user.constants';
import orderControllers from './order.controllers';
import { zodOrder } from './order.validation';

const router = express.Router();

router.post(
	'/',
	authorizeUser(USER_ROLES.CUSTOMER),
	validateRequest(zodOrder.creationSchema),
	orderControllers.createOrder,
);

router.get(
	'/',
	authorizeUser(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN),
	orderControllers.getOrders,
);
router.get('/revenue', orderControllers.getOrderRevenue);

export const orderRoutes = router;
