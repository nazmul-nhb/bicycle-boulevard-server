import type { Request, Response, NextFunction } from 'express';
import type {
	RAllProducts,
	RCreateProduct,
	TProduct,
	RSingleProduct,
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

		const product = await productServices.saveProductToDB(productData);

		if (product) {
			return res.status(201).json({
				success: true,
				message: `Bicycle created successfully!`,
				data: product,
			});
		}
	} catch (error) {
		next(error);
	}
};

/**
 *
 * @returns Returns all student data from the DB
 */
const getAllProducts = async (
	_req: Request,
	res: Response<RAllProducts>,
	next: NextFunction,
): Promise<Response<RAllProducts> | void> => {
	try {
		const products = await productServices.getAllProductsFromDB();

		return res.status(200).json({
			status: true,
			message: `Bicycles retrieved successfully!`,
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
				status: true,
				message: `Bicycle retrieved successfully!`,
				data: product,
			});
		} else {
			const notFoundError = new ErrorWithStatus(
				'ProductNotFoundError',
				`No bicycle matched with id: ${id}!`,
				404,
				'not_found',
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
	req: Request<{ id: string }, {}, Partial<TProduct>>,
	res: Response<RSingleProduct>,
	next: NextFunction,
): Promise<Response<RSingleProduct> | void> => {
	try {
		const { id } = req.params;
console.log(req.body);
		const update = zodProduct.updateSchema.parse(req.body);
console.log(update);
		const product = await productServices.updateProductInDB(id, update);

		if (product) {
			return res.status(200).json({
				status: true,
				message: `Bicycle updated successfully!`,
				data: product,
			});
		} else {
			const notFoundError = new ErrorWithStatus(
				'ProductNotFoundError',
				`Cannot update specified bicycle with id: ${id}!`,
				404,
				'not_found',
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
				status: true,
				message: `Bicycle deleted successfully!`,
				data: {},
			});
		} else {
			const notFoundError = new ErrorWithStatus(
				'ProductNotFoundError',
				`Cannot delete specified bicycle with id: ${id}!`,
				404,
				'not_found',
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
