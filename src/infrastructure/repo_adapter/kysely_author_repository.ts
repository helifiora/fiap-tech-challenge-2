import type { AuthorRepo } from "#application/repo/author_repo.ts";
import type { KyselyDatabase } from "#infrastructure/kysely_db.ts";
import { AuthorUser } from "#domain/model/author.ts";

export class KyselyAuthorRepo implements AuthorRepo {
  #db: KyselyDatabase;

  constructor(db: KyselyDatabase) {
    this.#db = db;
  }

  async getByEmail(email: string): Promise<AuthorUser | null> {
    const raw =
      (await this.#db
        .selectFrom("author")
        .where("email", "=", email)
        .selectAll()
        .executeTakeFirst()) ?? null;

    if (raw === null) {
      return null;
    }

    return new AuthorUser(raw.id, raw.email, raw.username, raw.password_hash);
  }

  async create(author: AuthorUser): Promise<void> {
    await this.#db
      .insertInto("author")
      .values({
        id: author.id,
        email: author.email,
        username: author.username,
        password_hash: author.passwordHash,
      })
      .execute();
  }
}
