import type { Request, Response, NextFunction } from 'express';
import type { RCreateOrder, ROrderRevenue, TOrder } from './order.types';
import { zodOrder } from './order.validation';
import orderServices from './order.services';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';

/**
 *
 * Create a new order
 */
const createOrder = async (
	req: Request<{}, {}, TOrder>,
	res: Response<RCreateOrder>,
	next: NextFunction,
): Promise<Response<RCreateOrder> | void> => {
	try {
		const orderData = zodOrder.creationSchema.parse(req.body);

		const order = await orderServices.saveOrderInDB(orderData);

		if (order) {
			return res.status(201).json({
				message: `Order created successfully!`,
				status: true,
				data: order,
			});
		} else {
			const serverError = new ErrorWithStatus(
				'ProductCreationError',
				`Failed to create the bicycle!`,
				500,
				'creation_failed',
				orderData.product,
				'create_product',
			);
			next(serverError);
		}
	} catch (error) {
		next(error);
	}
};

/**
 * Get Revenue from Orders
 */
const getOrderRevenue = async (
	_req: Request,
	res: Response<ROrderRevenue>,
	next: NextFunction,
): Promise<Response<ROrderRevenue> | void> => {
	try {
		const totalRevenue = await orderServices.calculateOrderRevenue();

		return res.status(200).json({
			message: 'Revenue calculated successfully!',
			status: true,
			data: { totalRevenue },
		});
	} catch (error) {
		next(error);
	}
};

export default { createOrder, getOrderRevenue };
