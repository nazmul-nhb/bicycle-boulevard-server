import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userValidations } from '../user/user.validation';
import { authControllers } from './auth.controllers';
import { authValidations } from './auth.validation';
import { uploadFile } from '../../utilities/uploadImage';
import { parseFormData } from '../../middlewares/parseFormData';
import authorizeUser from '../../middlewares/authorizeUser';
import { USER_ROLES } from '../user/user.constants';

const router = Router();

router.post(
	'/register',
	uploadFile.single('image'),
	parseFormData,
	validateRequest(userValidations.creationSchema),
	authControllers.registerUser,
);

router.post(
	'/login',
	validateRequest(authValidations.loginSchema),
	authControllers.loginUser,
);

router.post('/refresh-token', authControllers.refreshToken);

router.get(
	'/profile',
	authorizeUser(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN),
	authControllers.getCurrentUser,
);

export const authRoutes = router;
