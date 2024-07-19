import type { GetManyOptions, PostRepo } from "#application/repo/post_repo.ts";
import type { KyselyDatabase } from "../kysely_db.ts";
import { Post } from "#domain/model/post.ts";
import { undefined } from "valibot";

export class KyselyPostRepo implements PostRepo {
  #db: KyselyDatabase;

  constructor(db: KyselyDatabase) {
    this.#db = db;
  }

  async getMany(options: GetManyOptions): Promise<Post[]> {
    let query = this.#db.selectFrom("post");

    if (options.query) {
      const q = `%${options.query}%`;
      query = query.where((eb) =>
        eb.or([eb("title", "ilike", q), eb("content", "ilike", q)]),
      );
    }

    const items = await query.selectAll().execute();

    return items.map((s) => {
      return Post.restore({
        id: s.id,
        title: s.title,
        content: s.content,
        authorId: s.author_id,
        publishedAt: s.published_at,
      });
    });
  }

  async getById(id: string): Promise<Post | null> {
    const raw =
      (await this.#db
        .selectFrom("post")
        .where("post.id", "=", id)
        .selectAll()
        .executeTakeFirst()) ?? null;

    if (raw === null) {
      return null;
    }

    return Post.restore({
      id: raw.id,
      title: raw.title,
      content: raw.content,
      authorId: raw.author_id,
      publishedAt: raw.published_at,
    });
  }

  async save(model: Post): Promise<void> {
    await this.#db
      .insertInto("post")
      .values({
        id: model.id,
        content: model.content,
        published_at: model.publishedAt.toISOString(),
        title: model.title,
        author_id: model.authorId,
      })
      .execute();
  }

  async update(model: Post): Promise<void> {
    await this.#db
      .updateTable("post")
      .set({
        title: model.title,
        content: model.content,
      })
      .where("id", "=", model.id)
      .execute();
  }

  async delete(id: string): Promise<void> {
    await this.#db.deleteFrom("post").where("post.id", "=", id).execute();
  }
}
