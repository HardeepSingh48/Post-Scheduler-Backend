import { Request, Response, NextFunction } from 'express';
import { AuthenticationError } from '../utils/error.util';
import { verifyToken } from '../utils/jwt.util';

export const authenticate = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('No token provided');
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
};
