import type { Document, ObjectId } from 'mongoose';

export type TOrder = {
	email: string;
	product: ObjectId | string;
	quantity: number;
	totalPrice?: number;
};

export type TOrderDocument = TOrder & Document;

export type RCreateOrder = {
	message: string;
	status: boolean;
	data: TOrderDocument;
};
