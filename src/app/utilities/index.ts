import { ZodError } from 'zod';
import type { IMongoDuplicateError, IParserError } from '../types/interfaces';
import type { CastError } from 'mongoose';
import { MongooseError } from 'mongoose';
/**
 *
 * @param error Accepts an error of unknown type
 * @returns Returns error message as string
 */
const processErrorMsgs = (error: unknown): string => {
	// Process Zod Validation Error(s)
	if (error instanceof ZodError) {
		return error.errors
			.map((err) => {
				if (err.code === 'invalid_type') {
					return `Expected ${err.expected} for “${err.path}” but got ${err.received}!`;
				}
				return `${err.path.join('.')}: ${err.message}`;
			})
			.join('; ');
	} else if (
		// Process MongoDB Duplicate Error
		'code' in (error as IMongoDuplicateError) &&
		(error as IMongoDuplicateError).code === 11000
	) {
		const duplicateError = error as IMongoDuplicateError;
		const path = Object.keys(duplicateError.keyValue)[0];

		return `Duplicate “${path}” Found for “${duplicateError.keyValue[path]}”!`;
	} else if (error instanceof MongooseError) {
		return `Invalid ObjectId: ${(error as CastError).value}`;
	} else if (
		// Process Express Body Parser Error
		'type' in (error as IParserError) &&
		(error as IParserError).type === 'entity.parse.failed'
	) {
		return 'Invalid JSON Payload!';
	} else {
		// Process General Error
		return (error as Error).message;
	}
};

export default { processErrorMsgs };
