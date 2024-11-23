"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorWithStatus = void 0;
class ErrorWithStatus extends Error {
    constructor(name, message, status, type, value) {
        super(message);
        this.name = name;
        this.message = message;
        this.status = status;
        this.type = type;
        this.value = value;
        this.name = name;
        this.status = status;
        this.type = type;
        this.value = value;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.ErrorWithStatus = ErrorWithStatus;
