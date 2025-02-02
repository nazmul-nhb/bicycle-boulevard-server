import express from 'express';
import authorizeUser from '../../middlewares/authorizeUser';
import { parsePrimitives } from '../../middlewares/parsePrimitives';
import validateRequest from '../../middlewares/validateRequest';
import { uploadFile } from '../../utilities/uploadImage';
import { USER_ROLES } from '../user/user.constants';
import { productControllers } from './product.controllers';
import { zodProduct } from './product.validation';

const router = express.Router();

router.post(
	'/',
	authorizeUser(USER_ROLES.ADMIN),
	uploadFile.single('image'),
	parsePrimitives,
	validateRequest(zodProduct.creationSchema),
	productControllers.createProduct,
);

router.get('/', productControllers.getAllProducts);

router.get('/:id', productControllers.getSingleProduct);

router.put(
	'/:id',
	authorizeUser(USER_ROLES.ADMIN),
	uploadFile.single('image'),
	parsePrimitives,
	productControllers.updateProduct,
);

router.delete(
	'/:id',
	authorizeUser(USER_ROLES.ADMIN),
	productControllers.deleteProduct,
);

export const productRoutes = router;
