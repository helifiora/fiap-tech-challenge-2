import { afterEach, assert, beforeEach, test, inject, vi } from "vitest";
import { KyselyDatabase } from "#infrastructure/kysely_db.ts";
import { KyselyMigrator } from "#infrastructure/kysely_migrator.ts";
import { CreatePost } from "#application/usecase/post/create_post.ts";
import { PostRepo } from "#application/repo/post_repo.ts";
import { KyselyPostRepo } from "#infrastructure/repo_adapter/kisely_post_repository.ts";
import { KyselyAuthorRepo } from "#infrastructure/repo_adapter/kysely_author_repository.ts";
import { AuthorUser } from "#domain/model/author.ts";
import * as guidModule from "#domain/service/guid.ts";
import { setupKyselyDb } from "test/setup_kysely_db";
import { randomEmail } from "test/utils";
import { randomUUID } from "node:crypto";

let useCase: CreatePost;
let postRepo: PostRepo;

let db: KyselyDatabase;
let migrator: KyselyMigrator;

let authorId: string;

beforeEach(async () => {
  const connectionDb = inject("container");
  [db, migrator] = await setupKyselyDb(connectionDb);

  await migrator.toLatest();

  postRepo = new KyselyPostRepo(db);
  useCase = new CreatePost(postRepo);

  const authorRepo = new KyselyAuthorRepo(db);
  const author = await AuthorUser.create(
    randomEmail(),
    "John Doe",
    "test-hashed-password!",
  );

  await authorRepo.create(author);
  authorId = author.id;
});

afterEach(async () => {
  await migrator.toInitial();
});

test("should return a new post object", async () => {
  const id = randomUUID();

  vi.spyOn(guidModule, "createGuid").mockReturnValue(id);

  vi.useFakeTimers();
  vi.setSystemTime(new Date("2020-01-10T20:00:00"));

  const result = await useCase.handle({
    content: "John Doe 1 2 3",
    title: "Lorem 1 and 2",
    currentAuthorId: authorId,
  });

  assert.equal(result.id, id);
  assert.equal(result.content, "John Doe 1 2 3");
  assert.equal(result.title, "Lorem 1 and 2");
  assert.equal(result.authorId, authorId);
  assert.deepEqual(result.publishedAt, new Date("2020-01-10T20:00:00"));
  vi.useRealTimers();
});
