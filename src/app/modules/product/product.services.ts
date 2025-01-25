import type { FilterQuery } from 'mongoose';
import type {
	TProduct,
	TProductDocument,
	TProductNotDeleted,
	TUpdateProduct,
} from './product.types';
import { Product } from './product.model';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { STATUS_CODES } from '../../constants';
import { validateObjectId } from '../../utilities/validateObjectId';

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
			'Internal Server Error',
			`Failed to create the bicycle!`,
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'create_product',
		);
	}

	const { isDeleted: _skip, ...resultWithoutIsDeleted } = product.toObject();

	return resultWithoutIsDeleted as TProductNotDeleted;
};

/**
 * * Get all products from DB.
 *
 * @param searchTerm Search keyword.
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
			{ category: { $regex: searchTerm, $options: 'i' } },
		];
	}

	const products = await Product.find(filter);

	if (searchTerm && products.length < 1) {
		throw new ErrorWithStatus(
			'Not Matched Error',
			`No bicycle matched with search term: ${searchTerm}!`,
			STATUS_CODES.NOT_FOUND,
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
	id: string,
): Promise<TProductDocument> => {
	validateObjectId(id, 'product', 'get_product');

	const product = await Product.findById(id);

	if (!product) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No bicycle found with id: ${id}!`,
			STATUS_CODES.NOT_FOUND,
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
	id: string,
	update: TUpdateProduct,
): Promise<TProductDocument> => {
	validateObjectId(id, 'product', 'update_product');

	const updateOptions = [{ _id: id }, update, { new: true, rawResult: true }];

	const updatedProduct = await Product.findOneAndUpdate(...updateOptions);

	if (!updatedProduct) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`Cannot update specified bicycle with id: ${id}!`,
			STATUS_CODES.NOT_FOUND,
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
const deleteProductFromDB = async (id: string): Promise<TProductDocument> => {
	validateObjectId(id, 'product', 'delete_product');

	const product = await Product.findByIdAndUpdate(
		id,
		{ isDeleted: true },
		{ new: true },
	);

	if (!product) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`Cannot delete specified bicycle with id: ${id}!`,
			STATUS_CODES.NOT_FOUND,
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
