import express from 'express';
import { productControllers } from './product.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { zodProduct } from './product.validation';
import { uploadFile } from '../../utilities/uploadImage';
import { parsePrimitives } from '../../middlewares/parsePrimitives';
import authorizeUser from '../../middlewares/authorizeUser';
import { USER_ROLES } from '../user/user.constants';

const router = express.Router();

router.post(
	'/',
	authorizeUser(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN),
	uploadFile.single('image'),
	parsePrimitives,
	validateRequest(zodProduct.creationSchema),
	productControllers.createProduct,
);
router.get('/', productControllers.getAllProducts);
router.get('/:id', productControllers.getSingleProduct);
router.put('/:id', productControllers.updateProduct);
router.delete('/:id', productControllers.deleteProduct);

export const productRoutes = router;
