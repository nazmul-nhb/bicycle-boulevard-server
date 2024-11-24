"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorWithStatus = void 0;
/**
 * Create an instance of `Error` with custom properties
 *
 * @param name Error name
 * @param message Error message
 * @param status HTTP status code
 * @param type Type of Error
 * @param value Value for the Error
 * @param path Optional path for Error, default is `unknown`
 */
class ErrorWithStatus extends Error {
    constructor(name, message, status, type, value, path = 'unknown') {
        super(message);
        this.name = name;
        this.message = message;
        this.status = status;
        this.type = type;
        this.value = value;
        this.path = path;
        this.name = name;
        this.status = status;
        this.type = type;
        this.value = value;
        this.path = path;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.ErrorWithStatus = ErrorWithStatus;
