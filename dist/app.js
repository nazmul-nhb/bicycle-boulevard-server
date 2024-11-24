"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const utilities_1 = __importDefault(require("./app/utilities"));
const product_routes_1 = require("./app/modules/product/product.routes");
const order_routes_1 = require("./app/modules/order/order.routes");
const UnifiedError_1 = require("./app/classes/UnifiedError");
const ErrorWithStatus_1 = require("./app/classes/ErrorWithStatus");
const mongoose_1 = require("mongoose");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Root/Test Route
app.get('/', (_req, res) => {
    res.status(200).json({
        success: true,
        message: '🚴‍♂️ Bicycle Server is Running! 🏃',
    });
});
// Application Routes
app.use('/api/products', product_routes_1.productRoutes);
app.use('/api/orders', order_routes_1.orderRoutes);
// Error handler for 404
app.use((req, _res, next) => {
    const error = new ErrorWithStatus_1.ErrorWithStatus('NotFoundError', `Requested End-Point “${req.method}: ${req.url}” Not Found!`, 404, 'not_found', req.url, `${req.method}: ${req.url}`);
    next(error);
});
// Global Error Handler
app.use((error, req, res, next) => {
    // get unified error in structured format
    const unifiedError = new UnifiedError_1.UnifiedError(error, req.body);
    // Log error msg in the server console
    console.error(`🛑 Error: ${utilities_1.default.processErrorMsgs(error)}`);
    // Delegate to the default Express error handler if the headers have already been sent to the client
    if (res.headersSent) {
        return next(error);
    }
    // Parse appropriate status code
    const statusCode = error instanceof zod_1.ZodError
        ? 400
        : error instanceof ErrorWithStatus_1.ErrorWithStatus
            ? error.status
            : error instanceof mongoose_1.MongooseError
                ? error.name === 'ValidationError' ||
                    error.name === 'CastError'
                    ? 400
                    : error.name === 'DocumentNotFoundError'
                        ? 404
                        : 500
                : 500;
    res.status(statusCode).json(unifiedError.parseErrors());
});
exports.default = app;
