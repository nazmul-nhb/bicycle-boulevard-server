import { zodProduct } from './product.validation';
import productServices from './product.services';
import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';

/** * Create a new product (bicycle). */
const createProduct = catchAsync(async (req, res) => {
	const productData = zodProduct.creationSchema.parse(req.body);

	const product = await productServices.saveProductInDB(productData);

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

	const update = zodProduct.updateSchema.parse(req.body);

	// If client wants to update quantity, handle it properly
	if (update.quantity && update.quantity > 0) {
		update.inStock = true;
	}
	if (update.quantity && update.quantity <= 0) {
		update.inStock = false;
	}

	const product = await productServices.updateProductInDB(id, update);

	sendResponse(res, 'Bicycle', 'PATCH', product);
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
