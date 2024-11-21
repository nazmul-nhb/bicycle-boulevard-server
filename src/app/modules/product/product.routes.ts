import express from 'express';
import { productControllers } from './product.controllers';

const router = express.Router();

router.post('/', productControllers.createProduct);

export const productRoutes = router;
