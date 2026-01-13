// Type augmentation for Express Request
import { UserPayload } from './user.types';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload;
  }
}