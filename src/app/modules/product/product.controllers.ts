import type { Request, Response, NextFunction } from 'express';
import type {
	TAllProducts,
	TCreateProduct,
	TProduct,
	TSingleProduct,
	TUpdateProduct,
} from './product.types';
import { zodProduct } from './product.validation';
import productServices from './product.services';
import type { ObjectId } from 'mongoose';

/**
 *
 * Create a new product (bicycle)
 */
const createProduct = async (
	req: Request<{}, {}, TProduct>,
	res: Response<TCreateProduct>,
	next: NextFunction,
): Promise<Response<TCreateProduct> | void> => {
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
	res: Response<TAllProducts>,
	next: NextFunction,
): Promise<Response<TAllProducts> | void> => {
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
	res: Response<TSingleProduct>,
	next: NextFunction,
): Promise<Response<TSingleProduct> | void> => {
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
			throw new Error('No bicycle matched with the given ID!');
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
	res: Response<TSingleProduct>,
	next: NextFunction,
): Promise<Response<TSingleProduct> | void> => {
	try {
		const { id } = req.params;

		const update = zodProduct.updateSchema.parse(req.body);

		const product = await productServices.updateProductInDB(id, update);

		if (product) {
			return res.status(200).json({
				status: true,
				message: `Bicycle updated successfully!`,
				data: product,
			});
		} else {
			throw new Error('Cannot update specified bicycle!');
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
			throw new Error('Cannot delete specified bicycle!');
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
