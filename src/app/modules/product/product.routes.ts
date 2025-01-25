import express from 'express';
import { productControllers } from './product.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { zodProduct } from './product.validation';

const router = express.Router();

router.post(
	'/',
	validateRequest(zodProduct.creationSchema),
	productControllers.createProduct,
);
router.get('/', productControllers.getAllProducts);
router.get('/:id', productControllers.getSingleProduct);
router.put('/:id', productControllers.updateProduct);
router.delete('/:id', productControllers.deleteProduct);

export const productRoutes = router;
