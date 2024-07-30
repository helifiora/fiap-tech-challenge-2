import { assert, beforeEach, test, expect } from "vitest";
import { PostRepo } from "#application/repo/post_repo.ts";
import { AuthorUser } from "#domain/model/author.ts";
import { useDatabaseContainer } from "../../../use_database_container.ts";
import {
  NotFoundPostError,
  NotSameAuthorError,
  UpdatePost,
} from "#application/usecase/post/update_post.ts";
import { Post } from "#domain/model/post.ts";
import { randomUUID } from "node:crypto";

let useCase: UpdatePost;
let postRepo: PostRepo;

let authorId: string;

beforeEach(async () => {
  const repoFac = await useDatabaseContainer("update-post");

  postRepo = repoFac.postRepo();
  useCase = new UpdatePost(postRepo);

  const authorRepo = repoFac.authorRepo();
  const author = await AuthorUser.create(
    "johndoe@gmail.com",
    "John Doe",
    "test-hashed-password!",
  );

  await authorRepo.create(author);
  authorId = author.id;
});

test("should update post a new post object", async () => {
  const post = Post.create({
    authorId,
    content: "Lol 2 Lol 2 Lol 2",
    title: "Lorem 2",
  });

  await postRepo.save(post);

  const result = await useCase.handle({
    id: post.id,
    title: "Lorem 1",
    content: "Lol Lol Lol",
    currentAuthorId: authorId,
  });

  assert.equal(result.id, post.id);
  assert.equal(result.title, "Lorem 1");
  assert.equal(result.content, "Lol Lol Lol");
  assert.equal(result.authorId, authorId);
});

test("should throw NotFoundPostError when id not found", async () => {
  const post = Post.create({
    authorId,
    content: "Lol 2 Lol 2 Lol 2",
    title: "Lorem 2",
  });

  expect(() =>
    useCase.handle({
      id: post.id,
      title: "Lorem 1",
      content: "Lol Lol Lol",
      currentAuthorId: authorId,
    }),
  ).rejects.toThrow(NotFoundPostError);
});

test("should throw NotSameAuthorError when is not the author who change the post", async () => {
  const post = Post.create({
    authorId,
    content: "Lol 2 Lol 2 Lol 2",
    title: "Lorem 2",
  });

  await postRepo.save(post);

  expect(() =>
    useCase.handle({
      id: post.id,
      title: "Lorem 1",
      content: "Lol Lol Lol",
      currentAuthorId: randomUUID(),
    }),
  ).rejects.toThrow(NotSameAuthorError);
});
