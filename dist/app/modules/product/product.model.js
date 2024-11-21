"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    versionKey: false,
});
exports.Product = (0, mongoose_1.model)('Product', productSchema);
