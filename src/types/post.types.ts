import { PostStatus } from '@prisma/client';

// Post-related types
export interface CreatePostInput {
    content: string;
    scheduledAt?: Date;
    timezone: string;
    status?: PostStatus;
    mediaUrls?: string[];
}

export interface UpdatePostInput {
    content?: string;
    scheduledAt?: Date | null;
    timezone?: string;
    status?: PostStatus;
    mediaUrls?: string[];
}

export interface PostWithUser {
    id: string;
    content: string;
    imageUrl: string | null;
    imagePath: string | null;
    scheduledAt: Date | null;
    timezone: string;
    status: PostStatus;
    attempts: number;
    lastError: string | null;
    publishedAt: Date | null;
    userId: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface PostFilters {
    status?: PostStatus;
    userId?: string;
    fromDate?: Date;
    toDate?: Date;
}

export interface Post {
    id: string;
    content: string;
    scheduledAt: Date | null;
    status: string;
    mediaUrls: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
