import fs from 'fs/promises';
import path from 'path';
import { StorageService, UploadResult } from './storage.interface';
import { AppError } from '../../utils/error.util';

export class LocalStorageService implements StorageService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    }

    async uploadFile(file: Express.Multer.File): Promise<UploadResult> {
        const relativePath = `uploads/${file.filename}`;
        const url = `${this.baseUrl}/${relativePath}`;

        return {
            url,
            path: relativePath,
        };
    }

    async deleteFile(filePath: string): Promise<void> {
        try {
            const fullPath = path.join(process.cwd(), filePath);
            await fs.unlink(fullPath);
        } catch (error) {
            throw new AppError('Failed to delete file', 500);
        }
    }

    getFileUrl(filePath: string): string {
        return `${this.baseUrl}/${filePath}`;
    }
}
