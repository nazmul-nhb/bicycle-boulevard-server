import type { Document, Types } from 'mongoose';

export type TOrder = {
	email: string;
	product: Types.ObjectId;
	quantity: number;
	totalPrice?: number;
};

export type TOrderDocument = TOrder & Document;

export type RCreateProduct = {
	message: string;
	status: boolean;
	data: TOrderDocument;
};