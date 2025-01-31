import type { z } from 'zod';
import type { zodProduct } from './product.validation';
import type { Document, Types } from 'mongoose';

export type TProduct = z.infer<typeof zodProduct.creationSchema> & {
	image: string;
	isDeleted: boolean;
	createdBy: Types.ObjectId;
};

export type TUpdateProduct = z.infer<typeof zodProduct.updateSchema>;

export type TProductDocument = TProduct & Document;

export type TProductNotDeleted = Omit<TProductDocument, 'isDeleted'> & {
	createdBy: Types.ObjectId;
};

export type TSearchQuery = { searchTerm?: string };
