"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
/**
 *
 * @param error Accepts an error of unknown type
 * @returns Returns error message as string
 */
const processErrorMsgs = (error) => {
    // Process Zod Validation Error(s)
    if (error instanceof zod_1.ZodError) {
        return error.errors
            .map((err) => {
            if (err.code === 'invalid_type') {
                return `Expected ${err.expected} for “${err.path}” but got ${err.received}!`;
            }
            return `${err.path.join('.')}: ${err.message}`;
        })
            .join('; ');
    }
    else if (
    // Process MongoDB Duplicate Error
    'code' in error &&
        error.code === 11000) {
        const mongoError = error;
        const path = Object.keys(mongoError.keyValue)[0];
        return `Duplicate “${path}” Found for “${mongoError.keyValue[path]}”!`;
    }
    else if (
    // Process Express Body Parser Error
    'type' in error &&
        error.type === 'entity.parse.failed') {
        return 'Please, Send Data in Valid JSON Format!';
    }
    else {
        // Process General Error
        const generalError = error;
        return generalError.message;
    }
};
exports.default = {
    processErrorMsgs,
};
