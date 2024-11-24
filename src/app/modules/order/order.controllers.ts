import type { Request, Response, NextFunction } from 'express';
import type { RCreateOrder, TOrder } from './order.types';
import { zodOrder } from './order.validation';
import orderServices from './order.services';

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
		}
	} catch (error) {
		next(error);
	}
};

export default { createOrder };
