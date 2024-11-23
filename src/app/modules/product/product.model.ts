import { model, Schema } from 'mongoose';
import type { Query } from 'mongoose';
import type { TProductDocument } from './product.types';

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
			min: [0, 'Quantity must be a non-negative number!'],
		},
		inStock: {
			type: Boolean,
			required: [true, 'Stock availability must be specified!'],
			default: true,
		},
		isDeleted: {
			type: Boolean,
			required:false,
			default: false,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

// Get products that are not deleted
productSchema.pre(/^find/, function (next) {
	const query = this as Query<TProductDocument, TProductDocument>;

	query.find({ isDeleted: { $ne: true } });

	next();
});

// Remove `isDeleted` field before returning the document
productSchema.pre(/^find/, function (next) {
	const query = this as Query<TProductDocument, TProductDocument>;

	query.find().projection({ isDeleted: 0 });

	next();
});

export const Product = model<TProductDocument>('Product', productSchema);
