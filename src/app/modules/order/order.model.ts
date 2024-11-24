import { model, Schema } from 'mongoose';
import type { TOrderDocument } from './order.types';
import { Product } from '../product/product.model';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import productServices from '../product/product.services';
import type { TUpdateProduct } from '../product/product.types';
import { zodProduct } from '../product/product.validation';

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
	const product = await Product.findById(this.product);

	if (product) {
		if (!this.totalPrice) {
			this.totalPrice = product.price * this.quantity;
		}

		const remainingQuantity = product.quantity - this.quantity;

		const productUpdate: TUpdateProduct = { quantity: remainingQuantity };

		if (remainingQuantity < 0) {
			const insufficientStock = new ErrorWithStatus(
				' InsufficientStock',
				`In Stock: ${product.quantity}, but you ordered ${this.quantity} bicycles!`,
				507,
				'insufficient_stock',
				this.product.toString(),
				'create_order',
			);
			next(insufficientStock);
			return;
		}

		if (remainingQuantity <= 0) {
			productUpdate.inStock = false;
        }
        
        const sanitizedData = zodProduct.updateSchema.parse(productUpdate);

		await productServices.updateProductInDB(this.product, sanitizedData);
	} else {
		const notFoundError = new ErrorWithStatus(
			'NotFoundError',
			`No bicycle found with id: ${this.product} to create an order!`,
			404,
			'not_found',
			this.product.toString(),
			'create_order',
		);
		next(notFoundError);
	}
	next();
});

export const Order = model<TOrderDocument>('Order', orderSchema);
