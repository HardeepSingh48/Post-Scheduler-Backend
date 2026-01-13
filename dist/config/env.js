"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'default-secret',
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
};
