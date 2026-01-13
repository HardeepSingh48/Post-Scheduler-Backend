"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostController = exports.updatePostController = exports.getPostController = exports.getPostsController = exports.createPostController = void 0;
const postService_1 = require("../services/postService");
const storage_1 = require("../services/storage");
const createPostController = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const input = req.body;
        let imageUrl;
        let imagePath;
        if (req.file) {
            const uploadResult = await storage_1.storageService.uploadFile(req.file);
            imageUrl = uploadResult.url;
            imagePath = uploadResult.path;
        }
        const post = await (0, postService_1.createPost)(userId, input, imageUrl, imagePath);
        res.status(201).json({ status: 'success', data: { post } });
    }
    catch (error) {
        next(error);
    }
};
exports.createPostController = createPostController;
const getPostsController = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const pageParam = req.query.page;
        const limitParam = req.query.limit;
        const page = pageParam && typeof pageParam === 'string' ? parseInt(pageParam) : 1;
        const limit = limitParam && typeof limitParam === 'string' ? parseInt(limitParam) : 20;
        const result = await (0, postService_1.getPosts)(userId, undefined, page, limit);
        res.json({ status: 'success', data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.getPostsController = getPostsController;
const getPostController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            res.status(400).json({ status: 'error', message: 'Invalid post ID' });
            return;
        }
        const userId = req.user.id;
        const post = await (0, postService_1.getPostById)(id, userId);
        res.json({ status: 'success', data: { post } });
    }
    catch (error) {
        next(error);
    }
};
exports.getPostController = getPostController;
const updatePostController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            res.status(400).json({ status: 'error', message: 'Invalid post ID' });
            return;
        }
        const userId = req.user.id;
        const input = req.body;
        let imageUrl;
        let imagePath;
        if (req.file) {
            const uploadResult = await storage_1.storageService.uploadFile(req.file);
            imageUrl = uploadResult.url;
            imagePath = uploadResult.path;
        }
        const post = await (0, postService_1.updatePost)(id, userId, input, imageUrl, imagePath);
        res.json({ status: 'success', data: { post } });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePostController = updatePostController;
const deletePostController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            res.status(400).json({ status: 'error', message: 'Invalid post ID' });
            return;
        }
        const userId = req.user.id;
        await (0, postService_1.deletePost)(id, userId);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deletePostController = deletePostController;
