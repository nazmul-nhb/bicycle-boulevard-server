import { ObjectId } from 'mongoose';
import type {
	TProduct,
	TProductDocument,
	TUpdateProduct,
} from './product.interfaces';
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

/**
 *
 * @returns Returns all product data from the DB
 */
const getAllProductsFromDB = async (): Promise<TProductDocument[]> => {
	const result = await Product.find({});
	return result;
};

/**
 *
 * @param id Accepts MongoDB ObjectId for a product (bicycle)
 * @returns Returns matched product data from MongoDB or nothing
 */
const getSingleProductFromDB = async (
	id: ObjectId,
): Promise<TProductDocument | null> => {
	const result = await Product.findById(id);
	return result;
};

/**
 *
 * @param id Accepts MongoDB ObjectId for a product (bicycle)
 * @returns Returns updated product data from MongoDB if updates any
 */
const updateProductInDB = async (
	id: ObjectId,
	update: TUpdateProduct,
): Promise<TProductDocument | null> => {
	const updateArgs = [{ _id: id }, update, { new: true, upsert: true }];

	const result = await Product.findOneAndUpdate(...updateArgs);

	return result;
};

export default {
	saveProductToDB,
	getAllProductsFromDB,
	getSingleProductFromDB,
	updateProductInDB,
};
