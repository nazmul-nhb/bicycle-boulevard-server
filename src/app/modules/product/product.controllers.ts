import type { Request, Response, NextFunction } from 'express';
import type {
	TAllProducts,
	TCreateProduct,
	TProduct,
	TSingleProduct,
} from './product.interfaces';
import { zodProductSchema } from './product.validation';
import productServices from './product.services';
import { ObjectId } from 'mongoose';

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
		const product = zodProductSchema.parse(req.body);

		const result = await productServices.saveProductToDB(product);

		if (result) {
			return res.status(201).json({
				success: true,
				message: `Bicycle created successfully!`,
				data: result,
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

export const productControllers = {
	createProduct,
	getAllProducts,
	getSingleProduct,
};
