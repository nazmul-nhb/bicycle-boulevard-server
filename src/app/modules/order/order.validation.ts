import { z } from 'zod';
import { isValidObjectId } from 'mongoose';

const creationSchema = z.object({
	email: z
		.string({ message: 'Customer email is required!' })
		.trim()
		.email({ message: 'Must be a valid email address!' }),

	product: z
		.string({ message: 'Product ID is required!' })
		.trim()
		.refine((id) => isValidObjectId(id), {
			message: 'Invalid Product ID! Must be a valid MongoDB ObjectId!',
		}),

	quantity: z
		.number({ message: 'Order quantity is required!' })
		.min(1, { message: 'Quantity must be at least 1!' }),

	totalPrice: z
		.number()
		.min(0, { message: 'Total price must be a non-negative number!' })
		.optional(),
});

export const zodOrder = { creationSchema };
