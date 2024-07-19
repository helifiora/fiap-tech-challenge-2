import type { KyselyDatabase } from "#infrastructure/kysely_db.ts";
import type { RepoFactory } from "#application/repo/_factory.ts";
import type { AuthorRepo, PostRepo } from "#application/repo/mod.ts";

import pg from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { KyselyAuthorRepo } from "./kysely_author_repository.ts";
import { KyselyPostRepo } from "./kisely_post_repository.ts";

export class KyselyRepoFactory implements RepoFactory {
  connection: KyselyDatabase;

  #authorRepo: AuthorRepo;
  #postRepo: PostRepo;

  constructor(connectionString: string) {
    const dialect = new PostgresDialect({
      pool: new pg.Pool({ connectionString: connectionString }),
    });

    this.connection = new Kysely({ dialect });
    this.#authorRepo = new KyselyAuthorRepo(this.connection);
    this.#postRepo = new KyselyPostRepo(this.connection);
  }

  authorRepo(): AuthorRepo {
    return this.#authorRepo;
  }

  postRepo(): PostRepo {
    return this.#postRepo;
  }
}
