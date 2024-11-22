import type { z } from 'zod';
import type { zodProduct } from './product.validation';
import type { Document } from 'mongoose';

export type TProduct = z.infer<typeof zodProduct.creationSchema>;

export type TProductDocument = TProduct & Document;

export type TUpdateProduct = z.infer<typeof zodProduct.updateSchema>;

export type TCreateProduct = {
	success: boolean;
	message: string;
	data: TProductDocument;
};

export type TAllProducts = {
	// TODO: After getting assignment result, rename this status to success to maintain the consistency
	status: boolean;
	message: string;
	data: TProductDocument[];
};

export type TSingleProduct = {
	// TODO: After getting assignment result, rename this status to success to maintain the consistency
	status: boolean;
	message: string;
	data: TProductDocument;
};
