import { Queue } from 'bullmq';
import { redis } from '../config/redis';

export const postQueue = new Queue('post-publishing', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 50,
  },
});

export const addPostToQueue = async (postId: string, scheduledAt: Date | string) => {
  const scheduledDate = scheduledAt instanceof Date ? scheduledAt : new Date(scheduledAt);
  const delay = scheduledDate.getTime() - Date.now();
  if (delay > 0) {
    await postQueue.add('publish-post', { postId }, { delay });
  } else {
    await postQueue.add('publish-post', { postId });
  }
};

export const removePostFromQueue = async (postId: string) => {
  const jobs = await postQueue.getJobs(['delayed', 'waiting', 'active']);
  for (const job of jobs) {
    if (job.data.postId === postId) {
      await job.remove();
    }
  }
};

export const reschedulePostInQueue = async (postId: string, newScheduledAt: Date | string) => {
  await removePostFromQueue(postId);
  await addPostToQueue(postId, newScheduledAt);
};

export const getQueueStats = async () => {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    postQueue.getWaiting(),
    postQueue.getActive(),
    postQueue.getCompleted(),
    postQueue.getFailed(),
    postQueue.getDelayed(),
  ]);

  return {
    waiting: waiting.length,
    active: active.length,
    completed: completed.length,
    failed: failed.length,
    delayed: delayed.length,
  };
};