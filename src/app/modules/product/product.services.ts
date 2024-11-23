import type { ObjectId } from 'mongoose';
import type { TProduct, TProductDocument, TProductNotDeleted } from './product.types';
import { Product } from './product.model';
import { Types } from 'mongoose';

/**
 *
 * @param productData Accepts product data sent from client
 * @returns Saved product from MongoDB
 */
const saveProductToDB = async (
	productData: TProduct,
): Promise<TProductNotDeleted> => {
	const product = new Product(productData);

	const result = await product.save();

	const { isDeleted: _skip, ...resultWithoutIsDeleted } = result.toObject();
	return resultWithoutIsDeleted as TProductNotDeleted;
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
	id: string,
	update: Partial<TProduct>,
): Promise<TProductDocument | null> => {
	const objectId = new Types.ObjectId(id);

	const updateArgs = [{ _id: objectId }, update, { new: true }];

	const result = await Product.findOneAndUpdate(...updateArgs);
	console.log(result);
	return result;
};

/**
 * Marks a product as deleted in the database by setting the `isDeleted` flag to `true`.
 *
 * @param id Accepts custom product ID to identify a product.
 * @returns Returns updated (mark as deleted) product data from MongoDB if updates any.
 */
const deleteProductFromDB = async (
	id: ObjectId,
): Promise<TProductDocument | null> => {
	const result = await Product.findByIdAndUpdate(
		id,
		{ isDeleted: true },
		{ new: true },
	);

	return result;
};

export default {
	saveProductToDB,
	getAllProductsFromDB,
	getSingleProductFromDB,
	updateProductInDB,
	deleteProductFromDB,
};
