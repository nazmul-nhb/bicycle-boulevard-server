import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type {
	RAllProducts,
	RCreateProduct,
	TProduct,
	RSingleProduct,
	TUpdateProduct,
	TSearchQuery,
} from './product.types';
import { zodProduct } from './product.validation';
import productServices from './product.services';
import type { ObjectId } from 'mongoose';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';

/**
 *
 * Create a new product (bicycle)
 */
const createProduct = async (
	req: Request<{}, {}, TProduct>,
	res: Response<RCreateProduct>,
	next: NextFunction,
): Promise<Response<RCreateProduct> | void> => {
	try {
		const productData = zodProduct.creationSchema.parse(req.body);

		const product = await productServices.saveProductInDB(productData);

		if (product) {
			return res.status(201).json({
				message: `Bicycle created successfully!`,
				success: true,
				data: product,
			});
		} else {
			const serverError = new ErrorWithStatus(
				'ProductCreationError',
				`Failed to create the bicycle!`,
				500,
				'creation_failed',
				productData.name,
				'create_product',
			);
			next(serverError);
		}
	} catch (error) {
		next(error);
	}
};

/**
 *
 * Get all student data from the DB
 */
const getAllProducts: RequestHandler<
	{},
	RAllProducts,
	{},
	TSearchQuery
> = async (req, res, next) => {
	try {
		const { searchTerm } = req.query;

		const products = await productServices.getAllProductsFromDB(searchTerm);

		if (searchTerm && !products.length) {
			const notFoundError = new ErrorWithStatus(
				'QueryNotMatchedError',
				`No bicycle matched with search term: ${searchTerm}!`,
				404,
				'not_matched',
				searchTerm,
				'search_products',
			);
			next(notFoundError);
			return;
		}
		return res.status(200).json({
			message: `Bicycles retrieved successfully!`,
			status: true,
			data: products,
		});
	} catch (error) {
		next(error);
	}
};

/**
 *
 * Get a single product (bicycle) data for a given mongodb objectId
 */
const getSingleProduct = async (
	req: Request<{ id: ObjectId }>,
	res: Response<RSingleProduct>,
	next: NextFunction,
): Promise<Response<RSingleProduct> | void> => {
	try {
		const { id } = req.params;

		const product = await productServices.getSingleProductFromDB(id);

		if (product) {
			return res.status(200).json({
				message: `Bicycle retrieved successfully!`,
				status: true,
				data: product,
			});
		} else {
			const notFoundError = new ErrorWithStatus(
				'ProductNotFoundError',
				`No bicycle matched with id: ${id}!`,
				404,
				'not_found',
				id.toString(),
				'get_product',
			);
			next(notFoundError);
		}
	} catch (error) {
		next(error);
	}
};

/**
 *
 * Update a specific product (bicycle) by id
 */
const updateProduct = async (
	req: Request<{ id: ObjectId }, {}, TUpdateProduct>,
	res: Response<RSingleProduct>,
	next: NextFunction,
): Promise<Response<RSingleProduct> | void> => {
	try {
		const { id } = req.params;

		const update = zodProduct.updateSchema.parse(req.body);

		// If client wants to update quantity, handle it properly
		if (update.quantity && update.quantity > 0) {
			update.inStock = true;
		}
		if (update.quantity && update.quantity <= 0) {
			update.inStock = false;
		}

		const product = await productServices.updateProductInDB(id, update);

		if (product) {
			return res.status(200).json({
				message: `Bicycle updated successfully!`,
				status: true,
				data: product,
			});
		} else {
			const notFoundError = new ErrorWithStatus(
				'ProductNotFoundError',
				`Cannot update specified bicycle with id: ${id}!`,
				404,
				'not_found',
				id.toString(),
				'update_product',
			);
			next(notFoundError);
		}
	} catch (error) {
		next(error);
	}
};

/**
 * Mark a product as deleted by ID
 */
const deleteProduct = async (
	req: Request<{ id: ObjectId }>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params;

		const deleted = await productServices.deleteProductFromDB(id);

		if (deleted) {
			return res.status(200).json({
				message: `Bicycle deleted successfully!`,
				status: true,
				data: {},
			});
		} else {
			const notFoundError = new ErrorWithStatus(
				'ProductNotFoundError',
				`Cannot delete specified bicycle with id: ${id}!`,
				404,
				'not_found',
				id.toString(),
				'delete_product',
			);
			next(notFoundError);
		}
	} catch (error) {
		next(error);
	}
};

export const productControllers = {
	createProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
};
