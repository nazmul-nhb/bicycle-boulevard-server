import { ZodError } from 'zod';
import type { IMongoDuplicateError, IParserError } from '../types/interfaces';
import type { CastError } from 'mongoose';
import { MongooseError } from 'mongoose';
import { ErrorWithStatus } from './ErrorWithStatus';

interface FieldError {
	message: string;
	name: string;
	properties: Record<string, any>;
	kind: string;
	path?: string;
	value?: unknown;
}

interface UnifiedErrorResponse {
	message: string;
	success: boolean;
	error: {
		name: string;
		errors: Record<string, FieldError>;
	};
	stack: string;
}

/**
 * Create an instance of UnifiedError and methods to receive error response
 *
 * @param error Error as `unknown` type
 * @param input Optional input fields as object from `req.body`, default is null
 */
export class UnifiedError {
	private _error: unknown;
	private _input: Record<string, any> | null = null;

	constructor(error: unknown, input: Record<string, any> | null = null) {
		this._error = error;
		this._input = input;
	}

	/**
	 * Converts various errors into a unified error response.
	 */
	public parseErrors(): UnifiedErrorResponse {
		if (this._error instanceof ZodError) {
			return this._processZodError(this._error);
		} else if (this._isMongoDuplicateError(this._error)) {
			return this._processMongoDuplicateError(this._error);
		} else if (this._isMongoCastError(this._error)) {
			return this._processMongoCastError(this._error);
		} else if (this._isParserError(this._error)) {
			return this._processParserError(this._error);
		} else if (this._error instanceof Error) {
			return this._processGenericError(this._error);
		}

		return this._processUnknownError();
	}

	/**
	 * Handle Zod Errors
	 *
	 * @param error Accepts instance of ZodError
	 * @returns Unified error response
	 */
	private _processZodError(error: ZodError): UnifiedErrorResponse {
		const fieldErrors: Record<string, FieldError> = {};

		for (const err of error.errors) {
			// Determine the path as a string
			const path = err.path.join('.');

			// Extract the invalid value from the original input using the path
			const invalidValue =
				this._input &&
				path
					.split('.')
					.reduce(
						(obj, key) => (obj ? obj[key] : undefined),
						this._input,
					);

			if (err.code === 'invalid_type') {
				fieldErrors[path] = {
					message: `Expected '${err.expected}' for “${path}” but received '${err.received}'!`,
					name: 'ValidatorError',
					properties: {
						expected: err.expected,
						received: err.received,
						message: err.message,
					},
					kind: 'invalid_type',
					path: path || 'unknown',
					value: invalidValue ?? err.received,
				};
			} else if (err.code === 'unrecognized_keys') {
				const keys = err.keys.join(', ');
				fieldErrors[err.code] = {
					message: `${err.keys.length > 1 ? 'Keys' : 'Key'}: “${keys}” Not Allowed!`,
					name: 'ValidatorError',
					properties: {
						message: err.message,
						type: err.code,
					},
					kind: err.code,
					path: path || 'all',
					value: invalidValue ?? 'all',
				};
			} else {
				fieldErrors[path] = {
					message: err.message,
					name: 'ValidatorError',
					properties: {
						message: err.message,
						type: err.code,
					},
					kind: err.code,
					path: path || 'unknown',
					value: invalidValue ?? 'unknown',
				};
			}
		}

		return {
			message: 'Validation failed!',
			success: false,
			error: {
				name: error.name,
				errors: fieldErrors,
			},
			stack: this._generateStackTrace(error.stack),
		};
	}

	/**
	 * Handle MongoDB duplicate error
	 *
	 * @param error Accepts MongoDB duplicate error
	 * @returns Unified error response
	 */
	private _processMongoDuplicateError(
		error: IMongoDuplicateError,
	): UnifiedErrorResponse {
		const key = Object.keys(error.keyValue)[0];
		const value = error.keyValue[key];

		return {
			message: 'Duplicate Key Error',
			success: false,
			error: {
				name: 'MongoError',
				errors: {
					[key]: {
						message: `Duplicate “${key}” found for value “${value}”`,
						name: 'DuplicateKeyError',
						properties: { key, value },
						kind: 'duplicate',
						path: key,
						value: value,
					},
				},
			},
			stack: this._generateStackTrace(),
		};
	}

	/**
	 * Handle MongoDB cast error
	 *
	 * @param error Accepts MongoDB CastError
	 * @returns Unified error response
	 */
	private _processMongoCastError(error: CastError): UnifiedErrorResponse {
		return {
			message: 'BSONError: Invalid ObjectId',
			success: false,
			error: {
				name: 'MongoDBCastError',
				errors: {
					[error.path]: {
						message: `Invalid ObjectId: ${error.value}`,
						name: error.name,
						properties: {
							message: `Invalid ObjectId: ${error.value}`,
							type: error.kind,
						},
						kind: error.kind,
						path: error.path,
						value: error.value,
					},
				},
			},
			stack: this._generateStackTrace(error.stack),
		};
	}

	/**
	 * Handle JSON Parser errors
	 *
	 * @param error Accepts express parser error
	 * @returns Unified error response
	 */
	private _processParserError(error: IParserError): UnifiedErrorResponse {
		return {
			message: 'Invalid JSON payload',
			success: false,
			error: {
				name: 'ParserError',
				errors: {
					payload: {
						message: 'Please send valid JSON data',
						name: 'ParserError',
						properties: {},
						kind: 'invalid_payload',
						path: 'body',
						value: error.body,
					},
				},
			},
			stack: this._generateStackTrace(),
		};
	}

	/**
	 * Handle generic errors
	 *
	 * @param error Accepts instance of Error
	 * @returns Unified error response
	 */
	private _processGenericError(error: Error): UnifiedErrorResponse {
		if (this._isErrorWithStatus(error)) {
			return {
				message: error.message,
				success: false,
				error: {
					name: error.name,
					errors: {
						[error.type]: {
							message: error.message,
							name: error.name,
							properties: {
								message: error.message,
								type: error.type,
							},
							kind: error.type,
							path: error.path,
							value: error.value,
						},
					},
				},
				stack: this._generateStackTrace(error.stack),
			};
		}
		// Generic fallback error
		return {
			message: error.message || 'An error occurred',
			success: false,
			error: {
				name: error.name || 'Error',
				errors: {
					[error.name || 'unknown']: {
						message: error.message || 'An error occurred',
						name: 'Error',
						properties: {
							type: 'generic',
						},
						kind: 'generic_error',
						path: 'unknown',
						value: 'unknown',
					},
				},
			},
			stack: this._generateStackTrace(error.stack),
		};
	}

	/**
	 * Handle unknown errors
	 *
	 * @returns Unified error response
	 */
	private _processUnknownError(): UnifiedErrorResponse {
		return {
			message: 'An unknown error occurred',
			success: false,
			error: {
				name: 'UnknownError',
				errors: {},
			},
			stack: this._generateStackTrace(),
		};
	}

	/**
	 * Generate a stack trace if one doesn't exist
	 *
	 * @param existingStack Accepts optional existing error stack if there is any
	 * @returns Error stack
	 */
	private _generateStackTrace(existingStack?: string): string {
		if (existingStack) {
			// Regex to extract relevant parts of the stack trace
			const match = existingStack.match(/at (.*?)(?:\n|$)/g);
			if (match) {
				return match
					.join('\n    ')
					.replace(/^at /, 'Error: Something went wrong\n    at ');
			}
		}

		const fallbackError = new Error();
		return fallbackError.stack || 'No stack trace available!';
	}

	/**
	 * Helper method to check MongoDB duplicate error
	 *
	 * @param error Accepts any error
	 */
	private _isMongoDuplicateError(error: any): error is IMongoDuplicateError {
		return (
			typeof error === 'object' &&
			error?.code === 11000 &&
			error?.keyValue
		);
	}

	/**
	 * Helper method to check MongoDB cast error
	 *
	 * @param error Accepts any error
	 */
	private _isMongoCastError(error: any): error is CastError {
		return error?.name === 'CastError' && error instanceof MongooseError;
	}

	/**
	 * Helper method to check Express Parser error
	 *
	 * @param error Accepts any error
	 */
	private _isParserError(error: any): error is IParserError {
		return (
			typeof error === 'object' && error?.type === 'entity.parse.failed'
		);
	}

	/**
	 * Helper method to check error with status code
	 *
	 * @param error Accepts any error
	 */
	private _isErrorWithStatus(error: any): error is ErrorWithStatus {
		return error instanceof ErrorWithStatus;
	}
}
