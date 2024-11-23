"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodProduct = void 0;
const zod_1 = require("zod");
const creationSchema = zod_1.z.object({
    name: zod_1.z
        .string({ message: 'Name of the product is required!' })
        .trim()
        .min(1, { message: 'Product name must not be empty!' }),
    brand: zod_1.z
        .string({ message: 'Brand of the product is required!' })
        .trim()
        .min(1, { message: 'Product brand must not be empty!' }),
    price: zod_1.z
        .number({ message: 'Price of the product is required!' })
        .min(0, { message: 'Price must be a positive number!' }),
    type: zod_1.z.enum(['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'], {
        message: 'Product type must be one of: Mountain, Road, Hybrid, BMX, Electric!',
    }),
    description: zod_1.z
        .string({ message: 'Description of the product is required!' })
        .trim()
        .min(1, { message: 'Product description must not be empty!' }),
    quantity: zod_1.z
        .number({ message: 'Quantity of the product is required!' })
        .min(0, { message: 'Quantity must be a non-negative number!' }),
    inStock: zod_1.z
        .boolean({ message: 'Stock availability must be specified!' })
        .refine((val) => typeof val === 'boolean', {
        message: 'Stock value must be a boolean (true or false)!',
    }),
    isDeleted: zod_1.z.boolean().optional().default(false),
});
const updateSchema = creationSchema
    .partial()
    .omit({ isDeleted: true })
    .strict();
exports.zodProduct = {
    creationSchema,
    updateSchema,
};
