import { Router } from 'express';
import type { IRoute } from '../types/interfaces';
import { authRoutes } from '../modules/auth/auth.routes';
import { adminRoutes } from '../modules/admin/admin.routes';
import { productRoutes } from '../modules/product/product.routes';
import { orderRoutes } from '../modules/order/order.routes';

const router = Router();

const routes: IRoute[] = [
	{
		path: '/auth',
		route: authRoutes,
	},
	{
		path: '/admin',
		route: adminRoutes,
	},
	{
		path: '/products',
		route: productRoutes,
	},
	{
		path: '/orders',
		route: orderRoutes,
	},
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
