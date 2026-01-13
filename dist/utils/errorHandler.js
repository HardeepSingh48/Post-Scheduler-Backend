"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = exports.handleError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const handleError = (err, res) => {
    const { statusCode = 500, message = 'Internal Server Error' } = err;
    res.status(statusCode).json({
        success: false,
        message,
    });
};
exports.handleError = handleError;
const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);
exports.catchAsync = catchAsync;
