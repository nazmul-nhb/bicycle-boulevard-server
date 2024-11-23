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
exports.productControllers = void 0;
const product_validation_1 = require("./product.validation");
const product_services_1 = __importDefault(require("./product.services"));
const ErrorWithStatus_1 = require("../../classes/ErrorWithStatus");
/**
 *
 * Create a new product (bicycle)
 */
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productData = product_validation_1.zodProduct.creationSchema.parse(req.body);
        const product = yield product_services_1.default.saveProductToDB(productData);
        if (product) {
            return res.status(201).json({
                success: true,
                message: `Bicycle created successfully!`,
                data: product,
            });
        }
    }
    catch (error) {
        next(error);
    }
});
/**
 *
 * @returns Returns all student data from the DB
 */
const getAllProducts = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_services_1.default.getAllProductsFromDB();
        return res.status(200).json({
            status: true,
            message: `Bicycles retrieved successfully!`,
            data: products,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 *
 * Get a single product (bicycle) data for a given mongodb objectId
 */
const getSingleProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield product_services_1.default.getSingleProductFromDB(id);
        if (product) {
            return res.status(200).json({
                status: true,
                message: `Bicycle retrieved successfully!`,
                data: product,
            });
        }
        else {
            const notFoundError = new ErrorWithStatus_1.ErrorWithStatus('ProductNotFoundError', `No bicycle matched with id: ${id}!`, 404, 'not_found', 'get_product');
            next(notFoundError);
        }
    }
    catch (error) {
        next(error);
    }
});
/**
 *
 * Update a specific product (bicycle) by id
 */
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const update = product_validation_1.zodProduct.updateSchema.parse(req.body);
        const product = yield product_services_1.default.updateProductInDB(id, update);
        if (product) {
            return res.status(200).json({
                status: true,
                message: `Bicycle updated successfully!`,
                data: product,
            });
        }
        else {
            const notFoundError = new ErrorWithStatus_1.ErrorWithStatus('ProductNotFoundError', `Cannot update specified bicycle with id: ${id}!`, 404, 'not_found', 'update_product');
            next(notFoundError);
        }
    }
    catch (error) {
        next(error);
    }
});
/**
 * Mark a product as deleted by ID
 */
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield product_services_1.default.deleteProductFromDB(id);
        if (deleted) {
            return res.status(200).json({
                status: true,
                message: `Bicycle deleted successfully!`,
                data: {},
            });
        }
        else {
            const notFoundError = new ErrorWithStatus_1.ErrorWithStatus('ProductNotFoundError', `Cannot delete specified bicycle with id: ${id}!`, 404, 'not_found', 'delete_product');
            next(notFoundError);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.productControllers = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
};
