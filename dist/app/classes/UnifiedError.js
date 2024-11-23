"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedError = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const ErrorWithStatus_1 = require("./ErrorWithStatus");
/**
 * Create an instance of UnifiedError and methods to receive error response
 *
 * @param error Error as unknown type
 * @param input The input fields as object from `req.body` if there is any
 */
class UnifiedError {
    constructor(error, input = null) {
        this._input = null;
        this._error = error;
        this._input = input;
    }
    /**
     * Converts various errors into a unified error response.
     */
    parseErrors() {
        if (this._error instanceof zod_1.ZodError) {
            return this._processZodError(this._error);
        }
        else if (this._isMongoDuplicateError(this._error)) {
            return this._processMongoDuplicateError(this._error);
        }
        else if (this._isMongoCastError(this._error)) {
            return this._processMongoCastError(this._error);
        }
        else if (this._isParserError(this._error)) {
            return this._processParserError(this._error);
        }
        else if (this._error instanceof Error) {
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
    _processZodError(error) {
        const fieldErrors = {};
        for (const err of error.errors) {
            // Determine the path as a string
            const path = err.path.join('.');
            // Extract the invalid value from the original input using the path
            const invalidValue = this._input &&
                path
                    .split('.')
                    .reduce((obj, key) => (obj ? obj[key] : undefined), this._input);
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
                    value: invalidValue !== null && invalidValue !== void 0 ? invalidValue : err.received,
                };
            }
            else if (err.code === 'unrecognized_keys') {
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
                    value: invalidValue !== null && invalidValue !== void 0 ? invalidValue : 'all',
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
                    path: path || 'unknown',
                    value: invalidValue !== null && invalidValue !== void 0 ? invalidValue : 'unknown',
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
    _processMongoDuplicateError(error) {
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
    _processMongoCastError(error) {
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
    _processParserError(error) {
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
    _processGenericError(error) {
        if (this._isErrorWithStatus(error)) {
            // Specific handling for 404 Not Found errors
            if (error.status === 404) {
                return {
                    message: 'Resource Not Found!',
                    success: false,
                    error: {
                        name: error.name || 'NotFoundError',
                        errors: {
                            [error.type]: {
                                message: error.message,
                                name: error.name || 'NotFoundError',
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
        }
        // Generic error fallback
        return {
            message: error.message || 'An error occurred',
            success: false,
            error: {
                name: error.name || 'Error',
                errors: {
                    unknown: {
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
    _processUnknownError() {
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
    _generateStackTrace(existingStack) {
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
    _isMongoDuplicateError(error) {
        return (typeof error === 'object' &&
            (error === null || error === void 0 ? void 0 : error.code) === 11000 &&
            (error === null || error === void 0 ? void 0 : error.keyValue));
    }
    /**
     * Helper method to check MongoDB cast error
     *
     * @param error Accepts any error
     */
    _isMongoCastError(error) {
        return (error === null || error === void 0 ? void 0 : error.name) === 'CastError' && error instanceof mongoose_1.MongooseError;
    }
    /**
     * Helper method to check Express Parser error
     *
     * @param error Accepts any error
     */
    _isParserError(error) {
        return (typeof error === 'object' && (error === null || error === void 0 ? void 0 : error.type) === 'entity.parse.failed');
    }
    /**
     * Helper method to check error with status code
     *
     * @param error Accepts any error
     */
    _isErrorWithStatus(error) {
        return error instanceof ErrorWithStatus_1.ErrorWithStatus;
    }
}
exports.UnifiedError = UnifiedError;
