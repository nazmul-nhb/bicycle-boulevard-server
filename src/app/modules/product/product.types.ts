import type { Document, Types } from 'mongoose';
import type { z } from 'zod';
import type { zodProduct } from './product.validation';

export type TProduct = z.infer<typeof zodProduct.creationSchema> & {
	image: string;
	isDeleted: boolean;
	createdBy: Types.ObjectId;
};

export type TUpdateProduct = z.infer<typeof zodProduct.updateSchema>;

export type TProductDocument = TProduct & Document;

export type TMinimalProduct = Omit<TProductDocument, 'description'> & {};

export type TSearchQuery = { searchTerm?: string };
