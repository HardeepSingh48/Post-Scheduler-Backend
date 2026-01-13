"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const database_1 = __importDefault(require("../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const error_util_1 = require("../utils/error.util");
const jwt_util_1 = require("../utils/jwt.util");
const register = async (input) => {
    const { email, username, password, timezone, name } = input;
    // Check if user exists
    const existingUser = await database_1.default.user.findFirst({
        where: {
            OR: [{ email }, { username }],
        },
    });
    if (existingUser) {
        if (existingUser.email === email) {
            throw new error_util_1.ConflictError('Email already registered');
        }
        throw new error_util_1.ConflictError('Username already taken');
    }
    // Hash password with 12 salt rounds
    const hashedPassword = await bcryptjs_1.default.hash(password, 12);
    // Create user
    const user = await database_1.default.user.create({
        data: {
            email,
            username,
            password: hashedPassword,
            timezone,
            name,
        },
        select: {
            id: true,
            email: true,
            username: true,
            timezone: true,
        },
    });
    const userPayload = {
        id: user.id,
        email: user.email,
        username: user.username,
        timezone: user.timezone,
    };
    const { accessToken, refreshToken } = (0, jwt_util_1.generateTokens)(userPayload);
    return {
        user: userPayload,
        token: accessToken,
        refreshToken,
    };
};
exports.register = register;
const login = async (input) => {
    const { email, password } = input;
    // Find user
    const user = await database_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new error_util_1.AuthenticationError('Invalid email or password');
    }
    // Verify password
    const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
    if (!isValidPassword) {
        throw new error_util_1.AuthenticationError('Invalid email or password');
    }
    const userPayload = {
        id: user.id,
        email: user.email,
        username: user.username,
        timezone: user.timezone,
    };
    const { accessToken, refreshToken } = (0, jwt_util_1.generateTokens)(userPayload);
    return {
        user: userPayload,
        token: accessToken,
        refreshToken,
    };
};
exports.login = login;
const getProfile = async (userId) => {
    const user = await database_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            username: true,
            timezone: true,
        },
    });
    if (!user) {
        throw new error_util_1.AuthenticationError('User not found');
    }
    return user;
};
exports.getProfile = getProfile;
