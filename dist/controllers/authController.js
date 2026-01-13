"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const authService_1 = require("../services/authService");
const jwt_util_1 = require("../utils/jwt.util");
const error_util_1 = require("../utils/error.util");
const registerUser = async (req, res, next) => {
    try {
        const input = req.body;
        const result = await (0, authService_1.register)(input);
        res.status(201).json({ status: 'success', data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res, next) => {
    try {
        const input = req.body;
        const result = await (0, authService_1.login)(input);
        res.status(200).json({ status: 'success', data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
const getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await (0, authService_1.getProfile)(userId);
        res.status(200).json({ status: 'success', data: { user } });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserProfile = getUserProfile;
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new error_util_1.AuthenticationError('Refresh token is required');
        }
        // Verify refresh token
        const payload = (0, jwt_util_1.verifyRefreshToken)(refreshToken);
        // Generate new access token
        const newAccessToken = (0, jwt_util_1.generateAccessToken)(payload);
        res.status(200).json({
            status: 'success',
            data: {
                accessToken: newAccessToken,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
