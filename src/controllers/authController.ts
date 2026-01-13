import { Request, Response, NextFunction } from 'express';
import { register, login, getProfile } from '../services/authService';
import { RegisterInput, LoginInput } from '../types/user.types';
import { verifyRefreshToken, generateAccessToken } from '../utils/jwt.util';
import { AuthenticationError } from '../utils/error.util';

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input: RegisterInput = req.body;
    const result = await register(input);
    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input: LoginInput = req.body;
    const result = await login(input);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const user = await getProfile(userId);
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AuthenticationError('Refresh token is required');
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Generate new access token
    const newAccessToken = generateAccessToken(payload);

    res.status(200).json({
      status: 'success',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};