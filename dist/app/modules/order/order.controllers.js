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
const order_validation_1 = require("./order.validation");
const order_services_1 = __importDefault(require("./order.services"));
/**
 *
 * Create a new order
 */
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderData = order_validation_1.zodOrder.creationSchema.parse(req.body);
        const order = yield order_services_1.default.saveOrderInDB(orderData);
        if (order) {
            return res.status(201).json({
                message: `Order created successfully!`,
                status: true,
                data: order,
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = { createOrder };
