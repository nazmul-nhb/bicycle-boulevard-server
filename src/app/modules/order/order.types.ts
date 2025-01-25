import type { Document, Types } from 'mongoose';

export type TOrder = {
	email: string;
	product: Types.ObjectId | string;
	quantity: number;
	totalPrice?: number;
};

export type TOrderDocument = TOrder & Document;

export type RCreateOrder = {
	message: string;
	status: boolean;
	data: TOrderDocument;
};

export type ROrderRevenue = {
	message: string;
	status: boolean;
	data: { totalRevenue: number };
};

export type TCalculatedRevenue = {
	_id: null;
	total: number;
};
