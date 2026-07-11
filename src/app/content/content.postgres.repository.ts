import { pgPool } from "@/lib/postgres";

export const ContentPostgresRepository = {
  async getPostById(id: string) {
    const result = await pgPool.query(
      "SELECT * FROM posts WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      throw new Error("Post not found");
    }
    return result.rows[0];
  },

  async incrementViewCount(id: string, newCount: number) {
    const result = await pgPool.query(
      "UPDATE posts SET view_count = $1 WHERE id = $2 RETURNING *",
      [newCount, id]
    );
    if (result.rows.length === 0) {
      throw new Error("Post not found");
    }
    return result.rows[0];
  },
};