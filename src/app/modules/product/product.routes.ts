import express from 'express';
import { productControllers } from './product.controllers';

const router = express.Router();

router.post('/', productControllers.createProduct);
router.get('/', productControllers.getAllProducts);
router.get('/:id', productControllers.getSingleProduct);
router.put('/:id', productControllers.updateProduct);
router.delete('/:id', productControllers.deleteProduct);

export const productRoutes = router;
