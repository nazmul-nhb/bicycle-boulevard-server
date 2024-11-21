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
