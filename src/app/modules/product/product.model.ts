import { model, Schema } from 'mongoose';
import type { TProductDocument } from './product.interfaces';

const productSchema = new Schema<TProductDocument>(
	{
		name: {
			type: String,
			required: [true, 'Product name is required!'],
			trim: true,
			minlength: [1, 'Product name must not be empty!'],
		},
		brand: {
			type: String,
			required: [true, 'Product brand is required!'],
			trim: true,
			minlength: [1, 'Product brand must not be empty!'],
		},
		price: {
			type: Number,
			required: [true, 'Product price is required!'],
			min: [0, 'Product price must be a positive number!'],
		},
		type: {
			type: String,
			enum: ['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'],
			required: [true, 'Product type is required!'],
			trim: true,
		},
		description: {
			type: String,
			required: [true, 'Product description is required!'],
			minlength: [1, 'Product description must not be empty!'],
			trim: true,
		},
		quantity: {
			type: Number,
			required: [true, 'Product quantity is required!'],
			min: [0, 'Quantity must be a non-negative number!'], // Quantity can't be less than 0
		},
		inStock: {
			type: Boolean,
			required: [true, 'Stock availability must be specified!'],
			default: true,
		},
	},
	{ timestamps: true },
);

export const Product = model<TProductDocument>('Product', productSchema);
