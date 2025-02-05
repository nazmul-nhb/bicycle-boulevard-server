import type { Document, Types } from 'mongoose';
import type { z } from 'zod';
import type { zodProduct } from './product.validation';
import type { IUserDoc } from '../user/user.types';

export type TProduct = z.infer<typeof zodProduct.creationSchema> & {
	image: string;
	isDeleted: boolean;
	createdBy: Types.ObjectId;
};

export type TUpdateProduct = z.infer<typeof zodProduct.updateSchema>;

export type TProductDocument = TProduct &
	Document & {
		_id: Types.ObjectId;
		createdAt: string;
		updatedAt: string;
	};

export type TMinimalProduct = Omit<
	TProductDocument,
	'description' | 'isDeleted'
>;

export type TPopulatedProduct = { createdBy: IUserDoc };

export type TSearchQuery = { searchTerm?: string };
