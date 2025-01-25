import { Order } from './order.model';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import type { TCalculatedRevenue, TOrder, TOrderDocument } from './order.types';
import { STATUS_CODES } from '../../constants';

/**
 * * Save product order(s) in DB.
 * @param orderData Accepts order data sent from client
 * @returns Saved order from MongoDB
 */
const saveOrderInDB = async (orderData: TOrder): Promise<TOrderDocument> => {
	const order = await Order.create(orderData);

	if (!order) {
		throw new ErrorWithStatus(
			'Internal Server Error',
			`Failed to create order!`,
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'create_order',
		);
	}

	return order;
};

/** * Calculate total revenue for all the orders */
const calculateOrderRevenue = async (): Promise<number> => {
	const revenue: TCalculatedRevenue[] = await Order.aggregate([
		{
			$lookup: {
				from: 'products',
				localField: 'product',
				foreignField: '_id',
				as: 'bicycle',
			},
		},
		{ $unwind: '$bicycle' },
		{
			$group: {
				_id: null,
				total: {
					$sum: { $multiply: ['$bicycle.price', '$quantity'] },
				},
			},
		},
	]);

	return revenue.length && revenue[0].total;
};

export default { saveOrderInDB, calculateOrderRevenue };
