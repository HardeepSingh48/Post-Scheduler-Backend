import { Worker } from 'bullmq';
import { redis } from '../config/redis';
import prisma from '../config/database';
import { PostStatus } from '@prisma/client';

const worker = new Worker('post-publishing', async (job) => {
  const { postId } = job.data;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      console.error(`Post ${postId} not found`);
      return;
    }

    
    // For now, we'll simulate successful publishing
    console.log(`Publishing post ${postId}:`, post.content);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update status to PUBLISHED with timestamp
    await prisma.post.update({
      where: { id: postId },
      data: {
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });

    console.log(`Successfully published post ${postId}`);
  } catch (error) {
    console.error(`Failed to publish post ${postId}:`, error);

    // Update status to FAILED and store error
    await prisma.post.update({
      where: { id: postId },
      data: {
        status: PostStatus.FAILED,
        lastError: error instanceof Error ? error.message : 'Unknown error',
        attempts: { increment: 1 },
      },
    });

    throw error;
  }
}, {
  connection: redis,
});

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

export default worker;