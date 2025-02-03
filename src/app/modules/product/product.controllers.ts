import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import configs from '../../configs';
import { STATUS_CODES } from '../../constants';
import catchAsync from '../../utilities/catchAsync';
import { generateFileName } from '../../utilities/generateFileName';
import sendResponse from '../../utilities/sendResponse';
import { sendImageToCloudinary } from '../../utilities/uploadImage';
import productServices from './product.services';
import type { TProduct } from './product.types';
import { zodProduct } from './product.validation';

/** * Create a new product (bicycle). */
const createProduct = catchAsync(async (req, res) => {
	const productToCreate = req.body as TProduct;

	if (!req.file) {
		throw new ErrorWithStatus(
			'Image Required',
			`Require image to create new product!`,
			STATUS_CODES.BAD_REQUEST,
			'create_product',
		);
	}

	const fileName = generateFileName(productToCreate.name);

	const { secure_url } = await sendImageToCloudinary(
		fileName,
		req.file.buffer,
	);

	const product = await productServices.saveProductInDB(
		{
			...productToCreate,
			image: secure_url.split(configs.imageBaseUrl)[1],
		},
		req?.user?.email,
	);

	sendResponse(res, 'Bicycle', 'POST', product);
});

/** * Get all student data from the DB. */
const getAllProducts = catchAsync(async (req, res) => {
	const { searchTerm } = req.query;

	const products = await productServices.getAllProductsFromDB(
		searchTerm as string,
	);

	sendResponse(res, 'Bicycle', 'GET', products);
});

/** * Get a single product (bicycle) data for a given mongodb `objectId`. */
const getSingleProduct = catchAsync(async (req, res) => {
	const { id } = req.params;

	const product = await productServices.getSingleProductFromDB(id);

	sendResponse(res, 'Bicycle', 'GET', product);
});

/** * Update a specific product (bicycle) by mongodb `objectId`. */
const updateProduct = catchAsync(async (req, res) => {
	const { id } = req.params;

	// console.log(req.body);

	const update = zodProduct.updateSchema.parse(req.body);

	if (req.file) {
		const fileName = generateFileName(update.name || id);

		const { secure_url } = await sendImageToCloudinary(
			fileName,
			req.file.buffer,
		);

		update.image = secure_url.split(configs.imageBaseUrl)[1];
	}

	// If client wants to update quantity, handle it properly
	if (update.quantity) {
		update.inStock = update.quantity > 0;
	}
	if ('inStock' in update && update.inStock === false) {
		update.quantity = 0;
	}

	// console.log(update);

	await productServices.updateProductInDB(id, update);

	sendResponse(res, 'Bicycle', 'PATCH');
});

/** * Mark a product as deleted by mongodb `objectId`. */
const deleteProduct = catchAsync(async (req, res) => {
	const { id } = req.params;

	await productServices.deleteProductFromDB(id);

	sendResponse(res, 'Bicycle', 'DELETE');
});

export const productControllers = {
	createProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
};
