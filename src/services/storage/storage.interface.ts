// Storage service interface for cloud-ready architecture
export interface UploadResult {
    url: string;
    path: string;
}

export interface StorageService {
    uploadFile(file: Express.Multer.File): Promise<UploadResult>;
    deleteFile(path: string): Promise<void>;
    getFileUrl(path: string): string;
}
