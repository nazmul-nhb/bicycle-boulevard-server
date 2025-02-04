import { Router } from 'express';
import { adminControllers } from './admin.controllers';
import authorizeUser from '../../middlewares/authorizeUser';
import { USER_ROLES } from '../user/user.constants';

const router = Router();

router.patch(
	'/users/block/:id',
	authorizeUser(USER_ROLES.ADMIN),
	adminControllers.toggleUserStatus,
);

router.patch(
	'/users/unblock/:id',
	authorizeUser(USER_ROLES.ADMIN),
	adminControllers.toggleUserStatus,
);

export const adminRoutes = router;
