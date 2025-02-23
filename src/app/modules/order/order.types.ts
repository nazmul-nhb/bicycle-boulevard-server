import type { Document, Types } from 'mongoose';
import type { ORDER_STATUS, PAYMENT_STATUS } from './order.constants';

export type TOrder = {
	email: string;
	products: { product: Types.ObjectId | string; quantity: number }[];
	totalPrice: number;
	paymentStatus: (typeof PAYMENT_STATUS)[number];
	orderStatus: (typeof ORDER_STATUS)[number];
};

export type TOrderDocument = TOrder & Document;

export type TCalculatedRevenue = {
	_id: null;
	total: number;
};
