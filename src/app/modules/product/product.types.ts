import type { z } from 'zod';
import type { zodProduct } from './product.validation';
import type { Document } from 'mongoose';

export type TProduct = z.infer<typeof zodProduct.creationSchema>;

export type TProductDocument = TProduct & Document;

export type TProductNotDeleted = Omit<TProductDocument, 'isDeleted'>;

export type RCreateProduct = {
	success: boolean;
	message: string;
	data: TProductNotDeleted;
};

export type RAllProducts = {
	// TODO: After getting assignment result, rename this status to success to maintain the consistency
	status: boolean;
	message: string;
	data: TProductDocument[];
};

export type RSingleProduct = {
	// TODO: After getting assignment result, rename this status to success to maintain the consistency
	status: boolean;
	message: string;
	data: TProductDocument;
};
