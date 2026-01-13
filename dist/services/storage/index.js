"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageService = exports.createStorageService = void 0;
const local_storage_1 = require("./local.storage");
const createStorageService = () => {
    const storageType = process.env.STORAGE_TYPE || 'local';
    switch (storageType) {
        case 'local':
            return new local_storage_1.LocalStorageService();
        // Future implementations
        // case 's3':
        //   return new S3StorageService();
        // case 'cloudinary':
        //   return new CloudinaryStorageService();
        default:
            return new local_storage_1.LocalStorageService();
    }
};
exports.createStorageService = createStorageService;
exports.storageService = (0, exports.createStorageService)();
