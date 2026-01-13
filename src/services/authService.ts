import prisma from '../config/database';
import bcrypt from 'bcryptjs';
import { RegisterInput, LoginInput, AuthResponse, UserPayload } from '../types/user.types';
import { ConflictError, AuthenticationError } from '../utils/error.util';
import { generateTokens } from '../utils/jwt.util';

export const register = async (input: RegisterInput): Promise<AuthResponse & { refreshToken: string }> => {
  const { email, username, password, timezone, name } = input;

  // Check if user exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ConflictError('Email already registered');
    }
    throw new ConflictError('Username already taken');
  }

  // Hash password with 12 salt rounds
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
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

  const userPayload: UserPayload = {
    id: user.id,
    email: user.email,
    username: user.username,
    timezone: user.timezone,
  };

  const { accessToken, refreshToken } = generateTokens(userPayload);

  return {
    user: userPayload,
    token: accessToken,
    refreshToken,
  };
};

export const login = async (input: LoginInput): Promise<AuthResponse & { refreshToken: string }> => {
  const { email, password } = input;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new AuthenticationError('Invalid email or password');
  }

  const userPayload: UserPayload = {
    id: user.id,
    email: user.email,
    username: user.username,
    timezone: user.timezone,
  };

  const { accessToken, refreshToken } = generateTokens(userPayload);

  return {
    user: userPayload,
    token: accessToken,
    refreshToken,
  };
};

export const getProfile = async (userId: string): Promise<UserPayload> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      timezone: true,
    },
  });

  if (!user) {
    throw new AuthenticationError('User not found');
  }

  return user;
};