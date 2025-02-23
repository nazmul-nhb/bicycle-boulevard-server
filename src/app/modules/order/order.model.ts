import { model, Schema } from 'mongoose';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { STATUS_CODES } from '../../constants';
import { validateObjectId } from '../../utilities/validateObjectId';
import { Product } from '../product/product.model';
import productServices from '../product/product.services';
import type { TUpdateProduct } from '../product/product.types';
import { zodProduct } from '../product/product.validation';
import { ORDER_STATUS, PAYMENT_STATUS } from './order.constants';
import type { TOrderDocument } from './order.types';

const orderSchema = new Schema<TOrderDocument>(
	{
		email: {
			type: String,
			required: [true, 'Customer email is required!'],
			trim: true,
		},
		products: [
			{
				_id: false,
				product: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					required: [true, 'Product ID is required!'],
				},
				quantity: {
					type: Number,
					required: [true, 'Order quantity is required!'],
					min: [1, 'Quantity must be at least 1!'],
				},
			},
		],
		totalPrice: {
			type: Number,
			required: false,
			min: [0, 'Total price must be a non-negative number!'],
		},
		paymentStatus: {
			type: String,
			enum: PAYMENT_STATUS,
			default: 'pending',
		},
		orderStatus: {
			type: String,
			enum: ORDER_STATUS,
			default: 'pending',
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

// Calculate totalPrice if there is no hardcoded price in the request body
orderSchema.pre('save', async function (next) {
	// Validate all product IDs
	for (const item of this.products) {
		validateObjectId(item.product, 'product', 'create_order');
	}

	let totalPrice = 0;

	// Process each product in the order
	for (const item of this.products) {
		const product = await Product.findById(item.product);

		if (!product) {
			throw new ErrorWithStatus(
				'Not Found Error',
				`No product found with id: ${item.product}!`,
				STATUS_CODES.NOT_FOUND,
				'create_order',
			);
		}

		// Calculate total price for the order
		totalPrice += product.price * item.quantity;

		const remainingQuantity = product.quantity - item.quantity;

		const productUpdate: TUpdateProduct = { quantity: remainingQuantity };

		// Check stock availability
		if (remainingQuantity < 0) {
			throw new ErrorWithStatus(
				'Insufficient Stock',
				`Insufficient stock for product ${product.name}. In Stock: ${product.quantity}, Ordered: ${item.quantity}`,
				STATUS_CODES.CONFLICT,
				'create_order',
			);
		}

		// Update product stock
		if (product.quantity <= 0) {
			productUpdate.inStock = false;
		}

		const sanitizedData = zodProduct.updateSchema.parse(productUpdate);

		await productServices.updateProductInDB(
			item.product as string,
			sanitizedData,
		);
	}

	// Set the total price for the order
	if (!this.totalPrice) {
		this.totalPrice = totalPrice;
	}

	next();
});

export const Order = model<TOrderDocument>('Order', orderSchema);
