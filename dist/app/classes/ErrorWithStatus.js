"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorWithStatus = void 0;
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
