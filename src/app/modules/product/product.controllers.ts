import type { Request, Response, NextFunction } from 'express';
import type {
	TAllProducts,
	TCreateProduct,
	TProduct,
} from './product.interfaces';
import { zodProductSchema } from './product.validation';
import productServices from './product.services';

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

export const productControllers = {
	createProduct,
	getAllProducts,
};
