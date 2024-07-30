import { assert, beforeEach, test, vi } from "vitest";
import { CreatePost } from "#application/usecase/post/create_post.ts";
import { PostRepo } from "#application/repo/post_repo.ts";
import { AuthorUser } from "#domain/model/author.ts";
import * as guidModule from "#domain/service/guid.ts";
import { randomUUID } from "node:crypto";
import { useDatabaseContainer } from "../../../use_database_container.ts";

let useCase: CreatePost;
let postRepo: PostRepo;

let authorId: string;

beforeEach(async () => {
  const repoFac = await useDatabaseContainer("create-post");

  postRepo = repoFac.postRepo();
  useCase = new CreatePost(postRepo);

  const authorRepo = repoFac.authorRepo();
  const author = await AuthorUser.create(
    "johndoe@gmail.com",
    "John Doe",
    "test-hashed-password!",
  );

  await authorRepo.create(author);
  authorId = author.id;
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
