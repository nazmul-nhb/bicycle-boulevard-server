import { Order } from './order.model';
import type { TOrder, TOrderDocument } from './order.types';

/**
 *
 * @param productData Accepts product data sent from client
 * @returns Saved product from MongoDB
 */
const saveOrderInDB = async (orderData: TOrder): Promise<TOrderDocument> => {
	const product = new Order(orderData);

	const result = await product.save();

	return result;
};

export default { saveOrderInDB };
