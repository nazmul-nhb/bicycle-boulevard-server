import type { TProduct, TProductDocument } from './product.interfaces';
import { Product } from './product.model';

/**
 *
 * @param productData Accepts product data sent from client
 * @returns Saved product from MongoDB
 */
const saveProductToDB = async (
	productData: TProduct,
): Promise<TProductDocument> => {
	const product = new Product(productData);

	const result = await product.save();

    return result;
};

export default {
	saveProductToDB,
};
