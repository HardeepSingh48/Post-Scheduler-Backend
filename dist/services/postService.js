"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPosts = exports.deletePost = exports.updatePost = exports.getPostById = exports.getPosts = exports.createPost = void 0;
const database_1 = __importDefault(require("../config/database"));
const client_1 = require("@prisma/client");
const error_util_1 = require("../utils/error.util");
const queue_service_1 = require("./queue.service");
const createPost = async (userId, input, imageUrl, imagePath) => {
    const status = input.status || (input.scheduledAt ? client_1.PostStatus.SCHEDULED : client_1.PostStatus.DRAFT);
    const post = await database_1.default.post.create({
        data: {
            content: input.content,
            scheduledAt: input.scheduledAt,
            timezone: input.timezone,
            status,
            imageUrl,
            imagePath,
            userId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                },
            },
        },
    });
    // Schedule post if status is SCHEDULED (non-blocking, don't fail if queue fails)
    if (status === client_1.PostStatus.SCHEDULED && input.scheduledAt) {
        try {
            await (0, queue_service_1.addPostToQueue)(post.id, input.scheduledAt);
        }
        catch (error) {
            console.error('Failed to add post to queue:', error);
            // Don't throw error - post is still created successfully
        }
    }
    return post;
};
exports.createPost = createPost;
const getPosts = async (userId, filters, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const where = { userId };
    if (filters?.status) {
        where.status = filters.status;
    }
    if (filters?.fromDate || filters?.toDate) {
        where.scheduledAt = {};
        if (filters.fromDate) {
            where.scheduledAt.gte = filters.fromDate;
        }
        if (filters.toDate) {
            where.scheduledAt.lte = filters.toDate;
        }
    }
    const [posts, total] = await Promise.all([
        database_1.default.post.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
            orderBy: { scheduledAt: 'desc' },
            skip,
            take: limit,
        }),
        database_1.default.post.count({ where }),
    ]);
    return {
        posts,
        total,
        totalPages: Math.ceil(total / limit),
    };
};
exports.getPosts = getPosts;
const getPostById = async (id, userId) => {
    const post = await database_1.default.post.findFirst({
        where: { id, userId },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                },
            },
        },
    });
    if (!post) {
        throw new error_util_1.NotFoundError('Post');
    }
    return post;
};
exports.getPostById = getPostById;
const updatePost = async (id, userId, input, imageUrl, imagePath) => {
    const existingPost = await database_1.default.post.findUnique({
        where: { id },
    });
    if (!existingPost) {
        throw new error_util_1.NotFoundError('Post');
    }
    if (existingPost.userId !== userId) {
        throw new error_util_1.AuthorizationError('You can only update your own posts');
    }
    const updateData = {};
    if (input.content !== undefined)
        updateData.content = input.content;
    if (input.scheduledAt !== undefined)
        updateData.scheduledAt = input.scheduledAt;
    if (input.timezone !== undefined)
        updateData.timezone = input.timezone;
    if (input.status !== undefined)
        updateData.status = input.status;
    if (imageUrl !== undefined) {
        updateData.imageUrl = imageUrl;
        updateData.imagePath = imagePath || null;
    }
    const updatedPost = await database_1.default.post.update({
        where: { id },
        data: updateData,
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                },
            },
        },
    });
    // Handle rescheduling
    const newScheduledAt = input.scheduledAt !== undefined ? input.scheduledAt : existingPost.scheduledAt;
    const newStatus = input.status !== undefined ? input.status : existingPost.status;
    if (newStatus === client_1.PostStatus.DRAFT && existingPost.status === client_1.PostStatus.SCHEDULED) {
        await (0, queue_service_1.removePostFromQueue)(id);
    }
    else if (newStatus === client_1.PostStatus.SCHEDULED && newScheduledAt) {
        if (existingPost.status !== client_1.PostStatus.SCHEDULED || newScheduledAt.getTime() !== existingPost.scheduledAt?.getTime()) {
            await (0, queue_service_1.reschedulePostInQueue)(id, newScheduledAt);
        }
    }
    return updatedPost;
};
exports.updatePost = updatePost;
const deletePost = async (id, userId) => {
    const post = await database_1.default.post.findUnique({
        where: { id },
    });
    if (!post) {
        throw new error_util_1.NotFoundError('Post');
    }
    if (post.userId !== userId) {
        throw new error_util_1.AuthorizationError('You can only delete your own posts');
    }
    // Cancel scheduled job if exists
    if (post.status === client_1.PostStatus.SCHEDULED) {
        await (0, queue_service_1.removePostFromQueue)(id);
    }
    await database_1.default.post.delete({
        where: { id },
    });
};
exports.deletePost = deletePost;
const getAllPosts = async (filters, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const where = {};
    if (filters?.userId) {
        where.userId = filters.userId;
    }
    if (filters?.status) {
        where.status = filters.status;
    }
    if (filters?.fromDate || filters?.toDate) {
        where.scheduledAt = {};
        if (filters.fromDate) {
            where.scheduledAt.gte = filters.fromDate;
        }
        if (filters.toDate) {
            where.scheduledAt.lte = filters.toDate;
        }
    }
    const [posts, total] = await Promise.all([
        database_1.default.post.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
            orderBy: { scheduledAt: 'desc' },
            skip,
            take: limit,
        }),
        database_1.default.post.count({ where }),
    ]);
    return {
        posts,
        total,
        totalPages: Math.ceil(total / limit),
    };
};
exports.getAllPosts = getAllPosts;
