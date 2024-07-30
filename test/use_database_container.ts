import { inject } from "vitest";
import { RepoFactory } from "#application/repo/_factory.ts";
import { Kysely, PostgresDialect } from "kysely";
import { KyselyAuthorRepo } from "#infrastructure/repo_adapter/kysely_author_repository.ts";
import { KyselyPostRepo } from "#infrastructure/repo_adapter/kisely_post_repository.ts";
import pg from "pg";
import { KyselyDatabase } from "#infrastructure/kysely_db.ts";
import { AuthorRepo } from "#application/repo/author_repo.ts";
import { PostRepo } from "#application/repo/post_repo.ts";
// @ts-ignore
import { up } from "../migrations/0001_setup.js";

export async function useDatabaseContainer(name: string): Promise<RepoFactory> {
  const connection = inject("container");
  const schemaName = `${name}-${Math.random().toString(36).substring(7)}`;

  const repoFac = new TestContainerFactory(connection, schemaName);

  await repoFac.connection.schema
    .createSchema(schemaName)
    .ifNotExists()
    .execute();

  await up(repoFac.connection);

  return repoFac;
}

export class TestContainerFactory implements RepoFactory {
  connection: KyselyDatabase;

  #authorRepo: AuthorRepo;
  #postRepo: PostRepo;

  constructor(connectionString: string, schemaName: string) {
    const dialect = new PostgresDialect({
      pool: new pg.Pool({ connectionString: connectionString }),
    });

    this.connection = new Kysely({ dialect }).withSchema(schemaName) as any;
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
