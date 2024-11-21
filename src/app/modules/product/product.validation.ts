import { z } from 'zod';

export const zodProductSchema = z.object({
	name: z
		.string({ message: 'Name of the product is required!' })
		.min(1, { message: 'Product name must not be empty!' }),

	brand: z
		.string({ message: 'Brand of the product is required!' })
		.min(1, { message: 'Product brand must not be empty!' }),

	price: z
		.number({ message: 'Price of the product is required!' })
		.min(0, { message: 'Price must be a positive number!' }),

	type: z.enum(['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'], {
		message:
			'Product type must be one of: Mountain, Road, Hybrid, BMX, Electric!',
	}),

	description: z
		.string({ message: 'Description of the product is required!' })
		.min(1, { message: 'Product description must not be empty!' }),

	quantity: z
		.number({ message: 'Quantity of the product is required!' })
		.min(0, { message: 'Quantity must be a non-negative number!' }),

	inStock: z
		.boolean({ message: 'Stock availability must be specified!' })
		.refine((val) => typeof val === 'boolean', {
			message: 'Stock value must be a boolean (true or false)!',
		}),
});
