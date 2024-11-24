import { Order } from './order.model';
import type { TCalculatedRevenue, TOrder, TOrderDocument } from './order.types';

/**
 *
 * @param orderData Accepts order data sent from client
 * @returns Saved order from MongoDB
 */
const saveOrderInDB = async (orderData: TOrder): Promise<TOrderDocument> => {
	const order = new Order(orderData);

	const result = await order.save();

	return result;
};

/**
 * 
 * Calculate total revenue for all the orders
 */
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
