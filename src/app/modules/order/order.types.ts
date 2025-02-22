import type { Document, Types } from 'mongoose';

export type TOrder = {
	email: string;
	products: { id: Types.ObjectId | string; quantity: number }[];
	totalPrice?: number;
};

export type TOrderDocument = TOrder & Document;

export type TCalculatedRevenue = {
	_id: null;
	total: number;
};
