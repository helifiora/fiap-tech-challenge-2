import { test, assert } from "vitest";
import { useDatabaseContainer } from "../../use_database_container.ts";
import { KyselyAuthorRepo } from "#infrastructure/repo_adapter/kysely_author_repository.ts";
import { KyselyPostRepo } from "#infrastructure/repo_adapter/kisely_post_repository.ts";

test("should define items", async () => {
  const repoFactory = await useDatabaseContainer("repo-factory");
  assert.instanceOf(repoFactory.authorRepo(), KyselyAuthorRepo);
  assert.instanceOf(repoFactory.postRepo(), KyselyPostRepo);
});
