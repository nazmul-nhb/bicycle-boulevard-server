"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedError = void 0;
const zod_1 = require("zod");
class UnifiedError {
    constructor(error, input = null) {
        this.input = null;
        this.error = error;
        this.input = input; // Save original input if provided
    }
    /**
     * Converts various errors into a unified error response.
     */
    toResponse() {
        if (this.error instanceof zod_1.ZodError) {
            return this.processZodError(this.error);
        }
        else if (this.isMongoError(this.error)) {
            return this.processMongoError(this.error);
        }
        else if (this.isParserError(this.error)) {
            return this.processParserError(this.error);
        }
        else if (this.error instanceof Error) {
            return this.processGenericError(this.error);
        }
        return this.processUnknownError();
    }
    // Handle Zod errors
    processZodError(error) {
        const fieldErrors = {};
        for (const err of error.errors) {
            // Determine the path as a string
            const path = err.path.join('.');
            // Extract the invalid value from the original input using the path
            const invalidValue = this.input &&
                path
                    .split('.')
                    .reduce((obj, key) => (obj ? obj[key] : undefined), this.input);
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
                    value: invalidValue !== null && invalidValue !== void 0 ? invalidValue : err.received,
                };
            }
            else {
                fieldErrors[path] = {
                    message: err.message,
                    name: 'ValidatorError',
                    properties: {
                        message: err.message,
                        type: err.code,
                    },
                    kind: err.code,
                    path,
                    value: invalidValue !== null && invalidValue !== void 0 ? invalidValue : '',
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
    processMongoError(error) {
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
    processParserError(error) {
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
    processGenericError(error) {
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
    processUnknownError() {
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
    generateStackTrace(existingStack) {
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
    isMongoError(error) {
        return (typeof error === 'object' &&
            (error === null || error === void 0 ? void 0 : error.code) === 11000 &&
            (error === null || error === void 0 ? void 0 : error.keyValue));
    }
    isParserError(error) {
        return (typeof error === 'object' && (error === null || error === void 0 ? void 0 : error.type) === 'entity.parse.failed');
    }
}
exports.UnifiedError = UnifiedError;
