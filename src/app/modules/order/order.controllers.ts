import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import orderServices from './order.services';

/** * Create a new order */
const createOrder = catchAsync(async (req, res) => {
	const order = await orderServices.saveOrderInDB(req.body, req.user?.email);

	sendResponse(res, 'Order', 'POST', order, 'Order placed successfully!');
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
