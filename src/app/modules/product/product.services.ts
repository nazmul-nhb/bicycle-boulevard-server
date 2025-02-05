import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { STATUS_CODES } from '../../constants';
import { validateObjectId } from '../../utilities/validateObjectId';
import { User } from '../user/user.model';
import { Product } from './product.model';
import type {
	TMinimalProduct,
	TProduct,
	TProductDocument,
	TUpdateProduct,
} from './product.types';
import { QueryBuilder } from '../../classes/QueryBuilder';

/**
 * * Create a new product in DB.
 *
 * @param productData Accepts product data sent from client
 * @returns Saved product from MongoDB
 */
const saveProductInDB = async (productData: TProduct, email?: string) => {
	const user = await User.validateUser(email);

	const product = await Product.create({
		...productData,
		createdBy: user._id,
	});

	if (!product) {
		throw new ErrorWithStatus(
			'Internal Server Error',
			`Failed to create bicycle!`,
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'create_product',
		);
	}

	const {
		description: _1,
		isDeleted: _2,
		...resultWithoutIsDeleted
	} = product.toObject();

	return resultWithoutIsDeleted as TMinimalProduct;
};

/**
 * * Get all products from DB.
 *
 * @param search Search keyword.
 * @returns Returns all product data from the DB
 */
const getAllProductsFromDB = async (query?: Record<string, unknown>) => {
	const productQuery = new QueryBuilder(Product.find(), query)
		.search(['name', 'brand', 'category'])
		.filter()
		.sort();

	const products = await productQuery.modelQuery;

	// const products = await Product.find(filter)
	// 	.select({ description: 0 })
	// 	.exec();

	// if (searchTerm && products.length < 1) {
	// 	throw new ErrorWithStatus(
	// 		'Not Matched Error',
	// 		`No bicycle matched with search term: ${searchTerm}!`,
	// 		STATUS_CODES.NOT_FOUND,
	// 		'search_products',
	// 	);
	// }

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
