import jwt from 'jsonwebtoken';
import { UserPayload } from '../types/user.types';
import { AppError } from './error.util';
import { config } from '../config/env';

const JWT_SECRET = config.jwtSecret;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || config.jwtSecret + '_refresh';
const ACCESS_TOKEN_EXPIRES_IN = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // 7 days

export const generateAccessToken = (payload: UserPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
};

export const generateRefreshToken = (payload: UserPayload): string => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
};

export const generateTokens = (payload: UserPayload): { accessToken: string; refreshToken: string } => {
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
    };
};

export const verifyAccessToken = (token: string): UserPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as UserPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError('Access token expired', 401, true, 'TOKEN_EXPIRED');
        }
        throw new AppError('Invalid access token', 401, true, 'INVALID_TOKEN');
    }
};

export const verifyRefreshToken = (token: string): UserPayload => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET) as UserPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError('Refresh token expired', 401, true, 'REFRESH_TOKEN_EXPIRED');
        }
        throw new AppError('Invalid refresh token', 401, true, 'INVALID_REFRESH_TOKEN');
    }
};

// Keep old function for backward compatibility
export const generateToken = generateAccessToken;
export const verifyToken = verifyAccessToken;
