"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageService = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const error_util_1 = require("../../utils/error.util");
class LocalStorageService {
    constructor() {
        this.baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    }
    async uploadFile(file) {
        const relativePath = `uploads/${file.filename}`;
        const url = `${this.baseUrl}/${relativePath}`;
        return {
            url,
            path: relativePath,
        };
    }
    async deleteFile(filePath) {
        try {
            const fullPath = path_1.default.join(process.cwd(), filePath);
            await promises_1.default.unlink(fullPath);
        }
        catch (error) {
            throw new error_util_1.AppError('Failed to delete file', 500);
        }
    }
    getFileUrl(filePath) {
        return `${this.baseUrl}/${filePath}`;
    }
}
exports.LocalStorageService = LocalStorageService;
