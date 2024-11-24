"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodOrder = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const creationSchema = zod_1.z.object({
    email: zod_1.z
        .string({ message: 'Customer email is required!' })
        .email({ message: 'Must be a valid email address!' }),
    product: zod_1.z
        .string({ message: 'Product ID is required!' })
        .refine((id) => (0, mongoose_1.isValidObjectId)(id), {
        message: 'Invalid Product ID! Must be a valid MongoDB ObjectId!',
    }),
    quantity: zod_1.z
        .number({ message: 'Order quantity is required!' })
        .min(1, { message: 'Quantity must be at least 1!' }),
    totalPrice: zod_1.z
        .number()
        .min(0, { message: 'Total price must be a non-negative number!' })
        .optional(),
});
exports.zodOrder = { creationSchema };
