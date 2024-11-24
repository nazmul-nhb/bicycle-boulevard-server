"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const product_model_1 = require("../product/product.model");
const ErrorWithStatus_1 = require("../../classes/ErrorWithStatus");
const product_services_1 = __importDefault(require("../product/product.services"));
const product_validation_1 = require("../product/product.validation");
const orderSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Customer email is required!'],
        trim: true,
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
    versionKey: false,
});
// Calculate totalPrice if there is no hardcoded price in the request body
orderSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield product_model_1.Product.findById(this.product);
        if (product) {
            if (!this.totalPrice) {
                this.totalPrice = product.price * this.quantity;
            }
            const remainingQuantity = product.quantity - this.quantity;
            const productUpdate = { quantity: remainingQuantity };
            if (remainingQuantity < 0) {
                const insufficientStock = new ErrorWithStatus_1.ErrorWithStatus(' InsufficientStock', `In Stock: ${product.quantity}, but you ordered ${this.quantity} bicycles!`, 507, 'insufficient_stock', this.product.toString(), 'create_order');
                next(insufficientStock);
                return;
            }
            if (remainingQuantity <= 0) {
                productUpdate.inStock = false;
            }
            const sanitizedData = product_validation_1.zodProduct.updateSchema.parse(productUpdate);
            yield product_services_1.default.updateProductInDB(this.product, sanitizedData);
        }
        else {
            const notFoundError = new ErrorWithStatus_1.ErrorWithStatus('NotFoundError', `No bicycle found with id: ${this.product} to create an order!`, 404, 'not_found', this.product.toString(), 'create_order');
            next(notFoundError);
        }
        next();
    });
});
exports.Order = (0, mongoose_1.model)('Order', orderSchema);
