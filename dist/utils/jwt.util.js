"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateTokens = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_util_1 = require("./error.util");
const env_1 = require("../config/env");
const JWT_SECRET = env_1.config.jwtSecret;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || env_1.config.jwtSecret + '_refresh';
const ACCESS_TOKEN_EXPIRES_IN = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // 7 days
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
};
exports.generateRefreshToken = generateRefreshToken;
const generateTokens = (payload) => {
    return {
        accessToken: (0, exports.generateAccessToken)(payload),
        refreshToken: (0, exports.generateRefreshToken)(payload),
    };
};
exports.generateTokens = generateTokens;
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new error_util_1.AppError('Access token expired', 401, true, 'TOKEN_EXPIRED');
        }
        throw new error_util_1.AppError('Invalid access token', 401, true, 'INVALID_TOKEN');
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new error_util_1.AppError('Refresh token expired', 401, true, 'REFRESH_TOKEN_EXPIRED');
        }
        throw new error_util_1.AppError('Invalid refresh token', 401, true, 'INVALID_REFRESH_TOKEN');
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
// Keep old function for backward compatibility
exports.generateToken = exports.generateAccessToken;
exports.verifyToken = exports.verifyAccessToken;
