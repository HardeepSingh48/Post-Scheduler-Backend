import prisma from '../config/database';
import { CreatePostInput, UpdatePostInput, PostWithUser, PostFilters } from '../types/post.types';
import { PostStatus } from '@prisma/client';
import { NotFoundError, AuthorizationError } from '../utils/error.util';
import { addPostToQueue, removePostFromQueue, reschedulePostInQueue } from './queue.service';

export const createPost = async (
  userId: string,
  input: CreatePostInput,
  imageUrl?: string,
  imagePath?: string
): Promise<PostWithUser> => {
  const status = input.status || (input.scheduledAt ? PostStatus.SCHEDULED : PostStatus.DRAFT);

  const post = await prisma.post.create({
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
  if (status === PostStatus.SCHEDULED && input.scheduledAt) {
    try {
      await addPostToQueue(post.id, input.scheduledAt);
    } catch (error) {
      console.error('Failed to add post to queue:', error);
      // Don't throw error - post is still created successfully
    }
  }

  return post;
};

export const getPosts = async (
  userId: string,
  filters?: PostFilters,
  page: number = 1,
  limit: number = 20
): Promise<{ posts: PostWithUser[]; total: number; totalPages: number }> => {
  const skip = (page - 1) * limit;

  const where: {
    userId: string;
    status?: PostStatus;
    scheduledAt?: {
      gte?: Date;
      lte?: Date;
    };
  } = { userId };

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
    prisma.post.findMany({
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
    prisma.post.count({ where }),
  ]);

  return {
    posts,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const getPostById = async (id: string, userId: string): Promise<PostWithUser> => {
  const post = await prisma.post.findFirst({
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
    throw new NotFoundError('Post');
  }

  return post;
};

export const updatePost = async (
  id: string,
  userId: string,
  input: UpdatePostInput,
  imageUrl?: string,
  imagePath?: string
): Promise<PostWithUser> => {
  const existingPost = await prisma.post.findUnique({
    where: { id },
  });

  if (!existingPost) {
    throw new NotFoundError('Post');
  }

  if (existingPost.userId !== userId) {
    throw new AuthorizationError('You can only update your own posts');
  }

  const updateData: {
    content?: string;
    scheduledAt?: Date | null;
    timezone?: string;
    status?: PostStatus;
    imageUrl?: string | null;
    imagePath?: string | null;
  } = {};

  if (input.content !== undefined) updateData.content = input.content;
  if (input.scheduledAt !== undefined) updateData.scheduledAt = input.scheduledAt;
  if (input.timezone !== undefined) updateData.timezone = input.timezone;
  if (input.status !== undefined) updateData.status = input.status;
  if (imageUrl !== undefined) {
    updateData.imageUrl = imageUrl;
    updateData.imagePath = imagePath || null;
  }

  const updatedPost = await prisma.post.update({
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

  if (newStatus === PostStatus.DRAFT && existingPost.status === PostStatus.SCHEDULED) {
    await removePostFromQueue(id);
  } else if (newStatus === PostStatus.SCHEDULED && newScheduledAt) {
    if (existingPost.status !== PostStatus.SCHEDULED || newScheduledAt.getTime() !== existingPost.scheduledAt?.getTime()) {
      await reschedulePostInQueue(id, newScheduledAt);
    }
  }

  return updatedPost;
};

export const deletePost = async (id: string, userId: string): Promise<void> => {
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new NotFoundError('Post');
  }

  if (post.userId !== userId) {
    throw new AuthorizationError('You can only delete your own posts');
  }

  // Cancel scheduled job if exists
  if (post.status === PostStatus.SCHEDULED) {
    await removePostFromQueue(id);
  }

  await prisma.post.delete({
    where: { id },
  });
};

export const getAllPosts = async (
  filters?: PostFilters,
  page: number = 1,
  limit: number = 20
): Promise<{ posts: PostWithUser[]; total: number; totalPages: number }> => {
  const skip = (page - 1) * limit;

  const where: {
    userId?: string;
    status?: PostStatus;
    scheduledAt?: {
      gte?: Date;
      lte?: Date;
    };
  } = {};

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
    prisma.post.findMany({
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
    prisma.post.count({ where }),
  ]);

  return {
    posts,
    total,
    totalPages: Math.ceil(total / limit),
  };
};