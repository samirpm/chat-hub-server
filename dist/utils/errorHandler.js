"use strict";
// utils/errorHandler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.ErrorHandler = void 0;
class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
        Error.captureStackTrace(this);
    }
}
exports.ErrorHandler = ErrorHandler;
const handleError = (err, req, res, next) => {
    const { statusCode, message } = err;
    res.status(statusCode || 500).json({
        status: 'error',
        statusCode: statusCode || 500,
        message: message || 'Internal Server Error',
    });
};
exports.handleError = handleError;
