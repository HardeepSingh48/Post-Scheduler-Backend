import { Request, Response, NextFunction } from 'express';
import { createPost, getPosts, getPostById, updatePost, deletePost } from '../services/postService';
import { CreatePostInput, UpdatePostInput } from '../types/post.types';
import { storageService } from '../services/storage';

export const createPostController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const input: CreatePostInput = req.body;

    let imageUrl: string | undefined;
    let imagePath: string | undefined;

    if (req.file) {
      const uploadResult = await storageService.uploadFile(req.file);
      imageUrl = uploadResult.url;
      imagePath = uploadResult.path;
    }

    const post = await createPost(userId, input, imageUrl, imagePath);
    res.status(201).json({ status: 'success', data: { post } });
  } catch (error) {
    next(error);
  }
};

export const getPostsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const pageParam = req.query.page;
    const limitParam = req.query.limit;
    const page = pageParam && typeof pageParam === 'string' ? parseInt(pageParam) : 1;
    const limit = limitParam && typeof limitParam === 'string' ? parseInt(limitParam) : 20;

    const result = await getPosts(userId, undefined, page, limit);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const getPostController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      res.status(400).json({ status: 'error', message: 'Invalid post ID' });
      return;
    }
    const userId = req.user!.id;
    const post = await getPostById(id, userId);
    res.json({ status: 'success', data: { post } });
  } catch (error) {
    next(error);
  }
};

export const updatePostController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      res.status(400).json({ status: 'error', message: 'Invalid post ID' });
      return;
    }
    const userId = req.user!.id;
    const input: UpdatePostInput = req.body;

    let imageUrl: string | undefined;
    let imagePath: string | undefined;

    if (req.file) {
      const uploadResult = await storageService.uploadFile(req.file);
      imageUrl = uploadResult.url;
      imagePath = uploadResult.path;
    }

    const post = await updatePost(id, userId, input, imageUrl, imagePath);
    res.json({ status: 'success', data: { post } });
  } catch (error) {
    next(error);
  }
};

export const deletePostController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      res.status(400).json({ status: 'error', message: 'Invalid post ID' });
      return;
    }
    const userId = req.user!.id;
    await deletePost(id, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};