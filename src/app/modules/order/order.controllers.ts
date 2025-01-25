import { zodOrder } from './order.validation';
import orderServices from './order.services';
import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';

/** * Create a new order */
const createOrder = catchAsync(async (req, res) => {
	const orderData = zodOrder.creationSchema.parse(req.body);

	const order = await orderServices.saveOrderInDB(orderData);

	sendResponse(res, 'Order', 'GET', order, 'Order created successfully!');
});

/** * Get Revenue from Orders */
const getOrderRevenue = catchAsync(async (_req, res) => {
	const totalRevenue = await orderServices.calculateOrderRevenue();

	sendResponse(
		res,
		'Order',
		'GET',
		{ totalRevenue },
		'Revenue calculated successfully!',
	);
});

export default { createOrder, getOrderRevenue };
