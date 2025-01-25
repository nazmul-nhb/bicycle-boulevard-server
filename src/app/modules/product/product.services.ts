import type { FilterQuery, ObjectId } from 'mongoose';
import type {
	TProduct,
	TProductDocument,
	TProductNotDeleted,
	TUpdateProduct,
} from './product.types';
import { Product } from './product.model';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';

/**
 * * Create a new product in DB.
 *
 * @param productData Accepts product data sent from client
 * @returns Saved product from MongoDB
 */
const saveProductInDB = async (
	productData: TProduct,
): Promise<TProductNotDeleted> => {
	const product = await Product.create(productData);

	if (!product) {
		throw new ErrorWithStatus(
			'ProductCreationError',
			`Failed to create the bicycle!`,
			500,
			'create_product',
		);
	}

	const { isDeleted: _skip, ...resultWithoutIsDeleted } = product.toObject();

	return resultWithoutIsDeleted as TProductNotDeleted;
};

/**
 * * Get all products from DB.
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

	const products = await Product.find(filter);

	if (searchTerm && products.length < 1) {
		throw new ErrorWithStatus(
			'QueryNotMatchedError',
			`No bicycle matched with search term: ${searchTerm}!`,
			404,
			'search_products',
		);
	}

	return products;
};

/**
 * * Get a single product from DB based on id.
 *
 * @param id Accepts MongoDB ObjectId for a product (bicycle)
 * @returns Returns matched product data from MongoDB or nothing
 */
const getSingleProductFromDB = async (
	id: ObjectId,
): Promise<TProductDocument> => {
	const product = await Product.findById(id);

	if (!product) {
		throw new ErrorWithStatus(
			'ProductNotFoundError',
			`No bicycle found with id: ${id}!`,
			404,
			'get_product',
		);
	}

	return product;
};

/**
 * * Update a product in DB.
 *
 * @param id Accepts MongoDB ObjectId for a product (bicycle)
 * @returns Returns updated product data from MongoDB if updates any
 */
const updateProductInDB = async (
	id: ObjectId,
	update: TUpdateProduct,
): Promise<TProductDocument> => {
	const updateOptions = [{ _id: id }, update, { new: true, rawResult: true }];

	const updatedProduct = await Product.findOneAndUpdate(...updateOptions);

	if (!updatedProduct) {
		throw new ErrorWithStatus(
			'ProductNotFoundError',
			`Cannot update specified bicycle with id: ${id}!`,
			404,
			'update_product',
		);
	}

	return updatedProduct;
};

/**
 * Marks a product as deleted in the database by setting the `isDeleted` flag to `true`.
 *
 * @param id Accepts custom product ID to identify a product.
 * @returns Returns updated (mark as deleted) product data from MongoDB if updates any.
 */
const deleteProductFromDB = async (id: ObjectId): Promise<TProductDocument> => {
	const product = await Product.findByIdAndUpdate(
		id,
		{ isDeleted: true },
		{ new: true },
	);

	if (!product) {
		throw new ErrorWithStatus(
			'ProductNotFoundError',
			`Cannot delete specified bicycle with id: ${id}!`,
			404,
			'delete_product',
		);
	}

	return product;
};

export default {
	saveProductInDB,
	getAllProductsFromDB,
	getSingleProductFromDB,
	updateProductInDB,
	deleteProductFromDB,
};
