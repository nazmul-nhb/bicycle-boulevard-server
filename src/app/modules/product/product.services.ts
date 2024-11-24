import type { FilterQuery, ObjectId } from 'mongoose';
import type {
	TProduct,
	TProductDocument,
	TProductNotDeleted,
	TUpdateProduct,
} from './product.types';
import { Product } from './product.model';

/**
 *
 * @param productData Accepts product data sent from client
 * @returns Saved product from MongoDB
 */
const saveProductInDB = async (
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
const getAllProductsFromDB = async (
	searchTerm?: string,
): Promise<TProductDocument[]> => {
	const filter: FilterQuery<TProductDocument> = {};

	if (searchTerm) {
		filter.$or = [
			{ name: { $regex: searchTerm, $options: 'i' } },
			{ brand: { $regex: searchTerm, $options: 'i' } },
			{ type: { $regex: searchTerm, $options: 'i' } },
		];
	}

	const result = await Product.find(filter);
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
	id: ObjectId | string,
	update: TUpdateProduct,
): Promise<TProductDocument | null> => {
	const updateArgs = [{ _id: id }, update, { new: true, rawResult: true }];

	const result = await Product.findOneAndUpdate(...updateArgs);

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
	saveProductInDB,
	getAllProductsFromDB,
	getSingleProductFromDB,
	updateProductInDB,
	deleteProductFromDB,
};
