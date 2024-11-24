import type { z } from 'zod';
import type { zodProduct } from './product.validation';
import type { Document } from 'mongoose';

export type TProduct = z.infer<typeof zodProduct.creationSchema>;

export type TUpdateProduct = z.infer<typeof zodProduct.updateSchema>;

export type TProductDocument = TProduct & Document;

export type TProductNotDeleted = Omit<TProductDocument, 'isDeleted'>;

export type TSearchQuery = { searchTerm?: string };

export type RCreateProduct = {
	message: string;
	success: boolean;
	data: TProductNotDeleted;
};

export type RAllProducts = {
	// TODO: After getting assignment result, rename this status to success to maintain the consistency
	message: string;
	status: boolean;
	data: TProductDocument[];
};

export type RSingleProduct = {
	// TODO: After getting assignment result, rename this status to success to maintain the consistency
	message: string;
	status: boolean;
	data: TProductDocument;
};
