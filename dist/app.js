"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const utilities_1 = __importDefault(require("./app/utilities"));
const product_routes_1 = require("./app/modules/product/product.routes");
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
// Error handler for 404
app.use((req, _res, next) => {
    const error = new Error(`Requested End-Point “${req.method}: ${req.url}” Not Found!`);
    error.status = 404;
    next(error);
});
// Global Error Handler
app.use((error, _req, res, next) => {
    const errorMessage = utilities_1.default.processErrorMsgs(error);
    console.error('🛑 Error: ' + errorMessage);
    // Delegate to the default Express error handler if the headers have already been sent to the client
    if (res.headersSent) {
        return next(error);
    }
    res.status((error === null || error === void 0 ? void 0 : error.status) || 500).json({
        success: false,
        message: errorMessage,
    });
});
exports.default = app;
