import { Request, Response, NextFunction } from 'express';
import { getQueueStats } from '../services/queue.service';

export const getQueueStatsController = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await getQueueStats();
    res.status(200).json({ status: 'success', data: stats });
  } catch (error) {
    next(error);
  }
};