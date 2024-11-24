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
Object.defineProperty(exports, "__esModule", { value: true });
const order_model_1 = require("./order.model");
/**
 *
 * @param orderData Accepts order data sent from client
 * @returns Saved order from MongoDB
 */
const saveOrderInDB = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const order = new order_model_1.Order(orderData);
    const result = yield order.save();
    return result;
});
/**
 *
 * Calculate total revenue for all the orders
 */
const calculateOrderRevenue = () => __awaiter(void 0, void 0, void 0, function* () {
    const revenue = yield order_model_1.Order.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'bicycle',
            },
        },
        { $unwind: '$bicycle' },
        {
            $group: {
                _id: null,
                total: {
                    $sum: { $multiply: ['$bicycle.price', '$quantity'] },
                },
            },
        },
    ]);
    return revenue.length && revenue[0].total;
});
exports.default = { saveOrderInDB, calculateOrderRevenue };
