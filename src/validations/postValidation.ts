import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    content: z.string(),
    scheduledAt: z.string().optional(),
    mediaUrls: z.array(z.string()).optional(),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    content: z.string().optional(),
    scheduledAt: z.string().optional(),
    status: z.string().optional(),
    mediaUrls: z.array(z.string()).optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const getPostSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});