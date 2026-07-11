import { ContentPostgresRepository as ContentRepository } from "./content.postgres.repository";

const NOTIFY_THRESHOLD = 100;

export const ContentService = {
  async registerView(postId: string) {
    const post = await ContentRepository.getPostById(postId);
    const updatedCount = post.view_count + 1;

    const updatedPost = await ContentRepository.incrementViewCount(postId, updatedCount);

    if (updatedCount === NOTIFY_THRESHOLD) {
      await this.sendThresholdNotification(postId, updatedCount);
    }

    return updatedPost;
  },

  async sendThresholdNotification(postId: string, count: number) {
    console.log(`Post ${postId} reached ${count} views — notifying.`);
  },
};