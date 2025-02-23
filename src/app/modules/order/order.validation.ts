import { z } from 'zod';
import { isValidObjectId } from 'mongoose';

// Schema for each product in the array
const productSchema = z.object({
	product: z
		.string({ message: 'Product ID is required!' })
		.trim()
		.refine((id) => isValidObjectId(id), {
			message: 'Invalid Product ID! Must be a valid MongoDB ObjectId!',
		}),
	quantity: z
		.number({ message: 'Order quantity is required!' })
		.min(1, { message: 'Quantity must be at least 1!' }),
});

// Schema for the entire order (array of products)
const creationSchema = z.object({
	products: z
		.array(productSchema, {
			message: 'Products array is required!',
		})
		.min(1, { message: 'At least one product is required!' }),
});

export const zodOrder = { creationSchema };
