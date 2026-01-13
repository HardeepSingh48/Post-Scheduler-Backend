"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = void 0;
const error_util_1 = require("../utils/error.util");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const errorHandler = (err, req, res, _next) => {
    // Log error
    console.error({
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
    });
    // Handle known operational errors
    if (err instanceof error_util_1.AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            code: err.code,
            message: err.message,
        });
        return;
    }
    // Handle Zod validation errors
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            status: 'error',
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            errors: err.issues.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
        return;
    }
    // Handle Prisma errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            res.status(409).json({
                status: 'error',
                code: 'DUPLICATE_ENTRY',
                message: 'Resource already exists',
            });
            return;
        }
        if (err.code === 'P2025') {
            res.status(404).json({
                status: 'error',
                code: 'NOT_FOUND',
                message: 'Resource not found',
            });
            return;
        }
    }
    // Handle Multer errors
    if (err.name === 'MulterError') {
        res.status(400).json({
            status: 'error',
            code: 'FILE_UPLOAD_ERROR',
            message: err.message,
        });
        return;
    }
    // Default error response
    res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'development'
            ? err.message
            : 'An unexpected error occurred',
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res, _next) => {
    res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: `Route ${req.url} not found`,
    });
};
exports.notFoundHandler = notFoundHandler;
// Async handler wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
// Keep old export for compatibility
exports.errorMiddleware = exports.errorHandler;
