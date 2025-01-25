import type { z } from 'zod';
import type { zodProduct } from './product.validation';
import type { Document } from 'mongoose';

export type TProduct = z.infer<typeof zodProduct.creationSchema>;

export type TUpdateProduct = z.infer<typeof zodProduct.updateSchema>;

export type TProductDocument = TProduct & Document;

export type TProductNotDeleted = Omit<TProductDocument, 'isDeleted'>;

export type TSearchQuery = { searchTerm?: string };
