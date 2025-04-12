import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { STATUS_CODES } from '../../constants';
import type { DecodedUser } from '../../types/interfaces';
import { User } from '../user/user.model';
import { Order } from './order.model';
import type {
	TCalculatedRevenue,
	TOrder,
	TPopulatedOrder,
} from './order.types';

/**
 * Save a single order with multiple products in DB.
 * @param email User's email from req.user.email
 * @param orderData Array of { id: string, quantity: number } sent from client
 * @returns Saved order from MongoDB
 */
const saveOrderInDB = async (
	orderData: Pick<TOrder, 'products'>,
	email?: string,
) => {
	if (!email) {
		throw new ErrorWithStatus(
			'Authentication Error',
			'You must login first!',
			STATUS_CODES.UNAUTHORIZED,
			'create_order',
		);
	}

	// Create the order
	const order = await Order.create({ email, ...orderData });

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

/**
 * * Get all orders for both logged in customer and admin.
 * @param user Decoded user from token.
 * @returns Matched order data.
 */
const getOrderDataFromDB = async (user?: DecodedUser) => {
	const dbUser = await User.validateUser(user?.email);

	const filter: Record<string, string> = {};

	if (dbUser.role !== 'admin') {
		filter.email = dbUser.email;
	}

	const orders = await Order.find(filter).populate<TPopulatedOrder>({
		path: 'products.product',
		select: '-description -createdBy -isDeleted',
	});

	return orders;
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

export default { saveOrderInDB, getOrderDataFromDB, calculateOrderRevenue };
