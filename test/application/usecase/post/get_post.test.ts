import { assert, beforeEach, test } from "vitest";
import { PostRepo } from "#application/repo/post_repo.ts";
import { AuthorUser } from "#domain/model/author.ts";
import { Post } from "#domain/model/post.ts";
import { useDatabaseContainer } from "../../../use_database_container.ts";
import { GetPosts } from "#application/usecase/post/get_posts.ts";
import * as console from "node:console";

let useCase: GetPosts;
let postRepo: PostRepo;
let authorId: string;

beforeEach(async () => {
  const repoFac = await useDatabaseContainer("get-post");

  postRepo = repoFac.postRepo();
  useCase = new GetPosts(postRepo);

  const authorRepo = repoFac.authorRepo();
  const author = await AuthorUser.create(
    "johndoe@gmail.com",
    "John Doe",
    "test-hashed-password!",
  );

  await authorRepo.create(author);
  authorId = author.id;
});

test("should return all the items", async () => {
  const posts = [
    Post.create({
      authorId: authorId,
      content: "Lorem Ipsum 123",
      title: "Green 1",
    }),
    Post.create({
      authorId: authorId,
      content: "Lorem Ipsum 456",
      title: "Green 2",
    }),
    Post.create({
      authorId: authorId,
      content: "Lorem Ipsum 789",
      title: "Green 3",
    }),
  ];

  for (const item of posts) {
    await postRepo.save(item);
  }

  const result = await useCase.handle();
  assert.equal(result.length, 3);
});

test("should empty when there is no item", async () => {
  const result = await useCase.handle();
  assert.equal(result.length, 0);
});
