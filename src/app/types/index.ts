import type { Types } from 'mongoose';
import type { STATUS_CODES } from '../constants';

export type TCollection = 'N/A' | 'User' | 'Order' | 'Product' | 'Bicycle';

export type TMethod =
	| 'GET'
	| 'POST'
	| 'PUT'
	| 'DELETE'
	| 'PATCH'
	| 'OPTIONS'
	| 'OK';

export type TResponseDetails = { message: string; statusCode: number };

export type TStatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];

export type SearchField<T> = {
	[K in keyof T]: T[K] extends string | number ? K : never;
}[keyof T];

export type NumericKeys<T> = {
	[K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

export type ExcludeField<T> =
	`-${Extract<ExcludeVirtuals<FilterKeys<T>>, string>}`;

/** * Utility type to extract keys from `T` where the value is `string`, `number`, `boolean`, or `Date`. */
type FilterKeys<T> = {
	[K in keyof T]: T[K] extends (
		string | number | boolean | Date | Types.ObjectId
	) ?
		K
	:	never;
}[keyof T];

/** * Utility type to exclude Mongoose virtual properties (e.g., isNew). */
type ExcludeVirtuals<T> = Exclude<T, 'isNew' | 'id'>;
