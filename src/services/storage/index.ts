import { StorageService } from './storage.interface';
import { LocalStorageService } from './local.storage';

export const createStorageService = (): StorageService => {
    const storageType = process.env.STORAGE_TYPE || 'local';

    switch (storageType) {
        case 'local':
            return new LocalStorageService();
        // Future implementations
        // case 's3':
        //   return new S3StorageService();
        // case 'cloudinary':
        //   return new CloudinaryStorageService();
        default:
            return new LocalStorageService();
    }
};

export const storageService = createStorageService();
