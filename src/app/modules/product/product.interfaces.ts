import type { z } from 'zod';
import type { zodProductSchema } from './product.validation';
import type { Document } from 'mongoose';

export type TProduct = z.infer<typeof zodProductSchema>;

export type TProductDocument = TProduct & Document;

export type TCreateProduct = {
	success: boolean;
	message: string;
	data: TProductDocument;
};

export type TAllProducts = {
	// TODO: After getting assignment result, rename this status to success to maintain the coherency
	status: boolean;
	message: string;
	data: TProductDocument[];
};

export type TSingleProduct = {
	// TODO: After getting assignment result, rename this status to success to maintain the coherency
	status: boolean;
	message: string;
	data: TProductDocument;
};
