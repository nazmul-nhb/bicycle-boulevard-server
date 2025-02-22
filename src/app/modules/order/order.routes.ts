import express from 'express';
import authorizeUser from '../../middlewares/authorizeUser';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../user/user.constants';
import orderControllers from './order.controllers';
import { zodOrder } from './order.validation';

const router = express.Router();

router.post(
	'/',
	authorizeUser(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN), // ! remove admin after checking
	validateRequest(zodOrder.creationSchema),
	orderControllers.createOrder,
);
router.get('/revenue', orderControllers.getOrderRevenue);

export const orderRoutes = router;
