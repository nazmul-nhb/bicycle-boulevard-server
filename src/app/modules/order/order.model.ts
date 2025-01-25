import { model, Schema } from 'mongoose';
import type { TOrderDocument } from './order.types';
import { Product } from '../product/product.model';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import productServices from '../product/product.services';
import type { TUpdateProduct } from '../product/product.types';
import { zodProduct } from '../product/product.validation';
import { STATUS_CODES } from '../../constants';
import { validateObjectId } from '../../utilities/validateObjectId';

const orderSchema = new Schema<TOrderDocument>(
	{
		email: {
			type: String,
			required: [true, 'Customer email is required!'],
			trim: true,
		},
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
		totalPrice: {
			type: Number,
			required: false,
			min: [0, 'Total price must be a non-negative number!'],
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

// Calculate totalPrice if there is no hardcoded price in the request body
orderSchema.pre('save', async function (next) {
	const productId = this.product as string;

	validateObjectId(productId, 'product', 'create_order');

	const product = await Product.findById(productId);

	if (product) {
		if (!this.totalPrice) {
			this.totalPrice = product.price * this.quantity;
		}

		const remainingQuantity = product.quantity - this.quantity;

		const productUpdate: TUpdateProduct = { quantity: remainingQuantity };

		if (remainingQuantity < 0) {
			throw new ErrorWithStatus(
				'Insufficient Stock',
				`In Stock: ${product.quantity}, but you ordered ${this.quantity} bicycles!`,
				STATUS_CODES.CONFLICT,
				'create_order',
			);
		}

		if (remainingQuantity <= 0) {
			productUpdate.inStock = false;
		}

		const sanitizedData = zodProduct.updateSchema.parse(productUpdate);

		await productServices.updateProductInDB(productId, sanitizedData);
	} else {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No bicycle found with id: ${productId} to create an order!`,
			STATUS_CODES.NOT_FOUND,
			'create_order',
		);
	}

	next();
});

export const Order = model<TOrderDocument>('Order', orderSchema);
