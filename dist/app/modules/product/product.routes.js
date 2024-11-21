"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (_req, res) => {
    res.status(200).json({
        message: 'Bicycles retrieved successfully',
        status: true,
        data: [
            {
                _id: '648a45e5f0123c45678d9012',
                name: 'Roadster 5000',
                brand: 'SpeedX',
                price: 300,
                type: 'Road',
                description: 'A premium road bike designed for speed and performance.',
                quantity: 20,
                inStock: true,
                createdAt: '2024-11-19T10:23:45.123Z',
                updatedAt: '2024-11-19T10:23:45.123Z',
            },
            {
                _id: '648a45e5f0123c45678d9012',
                name: 'Roadster 6000',
                brand: 'SpeedX',
                price: 400,
                type: 'Road',
                description: 'A premium road bike designed for speed and performance.',
                quantity: 20,
                inStock: true,
                createdAt: '2024-11-19T10:23:45.123Z',
                updatedAt: '2024-11-19T10:23:45.123Z',
            },
        ],
    });
});
exports.productRoutes = router;
