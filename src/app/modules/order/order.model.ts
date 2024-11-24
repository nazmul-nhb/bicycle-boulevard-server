import { model, Schema } from 'mongoose';
import type { TOrderDocument } from './order.types';
import { Product } from '../product/product.model';

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
		timestamps: true, // Automatically adds `createdAt` and `updatedAt`
		versionKey: false,
	},
);

// Calculate totalPrice if there is no hardcoded price in the request body
orderSchema.pre('save', async function (next) {
	if (!this.totalPrice) {
        const product = await Product.findById(this.product);
        
		if (product) {
			this.totalPrice = product.price * this.quantity;
		} else {
			return next(new Error('Product Not Found!'));
		}
	}
	next();
});

export const Order = model<TOrderDocument>('Order', orderSchema);
