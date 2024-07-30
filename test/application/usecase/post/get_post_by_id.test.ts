import { assert, beforeEach, test } from "vitest";
import { PostRepo } from "#application/repo/post_repo.ts";
import { AuthorUser } from "#domain/model/author.ts";
import { Post } from "#domain/model/post.ts";
import { useDatabaseContainer } from "../../../use_database_container.ts";
import { GetPostById } from "#application/usecase/post/get_post_by_id.ts";

let useCase: GetPostById;
let postRepo: PostRepo;
let authorId: string;

beforeEach(async () => {
  const repoFac = await useDatabaseContainer("get-post-by-id");

  postRepo = repoFac.postRepo();
  useCase = new GetPostById(postRepo);

  const authorRepo = repoFac.authorRepo();
  const author = await AuthorUser.create(
    "johndoe@gmail.com",
    "John Doe",
    "test-hashed-password!",
  );

  await authorRepo.create(author);
  authorId = author.id;
});

test("should return item", async () => {
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

  const result = await useCase.handle({ id: posts[0].id });
  assert.isNotNull(result);
});

test("should return null when there is no item with this id", async () => {
  const result = await useCase.handle({
    id: "840c65a4-e83b-4ff2-81eb-4d1b24e4a37c",
  });

  assert.isNull(result);
});
