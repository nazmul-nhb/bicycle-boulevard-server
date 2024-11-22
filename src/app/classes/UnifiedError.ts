import { ZodError } from 'zod';
import type { MongoError, ParserError } from '../types/interfaces';

interface FieldError {
	message: string;
	name: string;
	properties: Record<string, any>;
	kind: string;
	path: string;
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

export class UnifiedError {
	private error: unknown;
	private input: Record<string, any> | null = null;

	constructor(error: unknown, input: Record<string, any> | null = null) {
		this.error = error;
		this.input = input; // Save original input if provided
	}

	/**
	 * Converts various errors into a unified error response.
	 */
	public toResponse(): UnifiedErrorResponse {
		if (this.error instanceof ZodError) {
			return this.processZodError(this.error);
		} else if (this.isMongoError(this.error)) {
			return this.processMongoError(this.error);
		} else if (this.isParserError(this.error)) {
			return this.processParserError(this.error);
		} else if (this.error instanceof Error) {
			return this.processGenericError(this.error);
		}

		return this.processUnknownError();
	}

	// Handle Zod errors
	private processZodError(error: ZodError): UnifiedErrorResponse {
		const fieldErrors: Record<string, FieldError> = {};

		for (const err of error.errors) {
			// Determine the path as a string
			const path = err.path.join('.');

			// Extract the invalid value from the original input using the path
			const invalidValue =
				this.input &&
				path
					.split('.')
					.reduce(
						(obj, key) => (obj ? obj[key] : undefined),
						this.input,
					);

			if (err.code === 'invalid_type') {
				fieldErrors[path] = {
					message: `Expected ${err.expected} for “${path}” but got ${err.received}!`,
					name: 'zodValidatorError',
					properties: {
						expected: err.expected,
						received: err.received,
						message: err.message,
					},
					kind: 'invalid_type',
					path,
					value: invalidValue ?? err.received,
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
					path,
					value: invalidValue ?? '',
				};
			}
		}

		return {
			message: 'Validation failed',
			success: false,
			error: {
				name: error.name,
				errors: fieldErrors,
			},
			stack: this.generateStackTrace(error.stack),
		};
	}

	// Handle MongoDB duplicate key errors
	private processMongoError(error: MongoError): UnifiedErrorResponse {
		const key = Object.keys(error.keyValue)[0];
		const value = error.keyValue[key];

		return {
			message: 'Duplicate key error',
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
			stack: this.generateStackTrace(),
		};
	}

	// Handle JSON Parser errors
	private processParserError(error: ParserError): UnifiedErrorResponse {
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
			stack: this.generateStackTrace(),
		};
	}

	// Handle generic errors
	private processGenericError(error: Error): UnifiedErrorResponse {
		return {
			message: error.message || 'An error occurred',
			success: false,
			error: {
				name: error.name || 'Error',
				errors: {},
			},
			stack: this.generateStackTrace(error.stack),
		};
	}

	// Handle unknown errors
	private processUnknownError(): UnifiedErrorResponse {
		return {
			message: 'An unknown error occurred',
			success: false,
			error: {
				name: 'UnknownError',
				errors: {},
			},
			stack: this.generateStackTrace(),
		};
	}

	// Generate a stack trace if one doesn't exist
	private generateStackTrace(existingStack?: string): string {
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
		return fallbackError.stack || 'No stack trace available';
	}

	// Helper methods to check error types
	private isMongoError(error: any): error is MongoError {
		return (
			typeof error === 'object' &&
			error?.code === 11000 &&
			error?.keyValue
		);
	}

	private isParserError(error: any): error is ParserError {
		return (
			typeof error === 'object' && error?.type === 'entity.parse.failed'
		);
	}
}
