import { assert, beforeEach, test, expect } from "vitest";
import { PostRepo } from "#application/repo/post_repo.ts";
import { AuthorUser } from "#domain/model/author.ts";
import { Post } from "#domain/model/post.ts";
import {
  DeleteNotAuthorizedError,
  DeletePost,
} from "#application/usecase/post/delete_post.ts";
import { useDatabaseContainer } from "../../../use_database_container.ts";
import { createGuid } from "#domain/service/guid.ts";

let useCase: DeletePost;
let postRepo: PostRepo;

let post: Post;
let authorId: string;

beforeEach(async () => {
  const repoFac = await useDatabaseContainer("delete-post");

  postRepo = repoFac.postRepo();
  useCase = new DeletePost(postRepo);

  const authorRepo = repoFac.authorRepo();
  const author = await AuthorUser.create(
    "johndoe@gmail.com",
    "John Doe",
    "test-hashed-password!",
  );

  await authorRepo.create(author);
  authorId = author.id;

  post = Post.create({
    authorId: author.id,
    content: "Lorem Ipsum",
    title: "Green",
  });

  await postRepo.save(post);
});

test("should remove from database successfuly", async () => {
  await useCase.handle({
    id: post.id,
    currentAuthorId: authorId,
  });

  const result = await postRepo.getById(post.id);
  assert.isNull(result);
});

test("should not remove nothing", async () => {
  const id = createGuid();
  await useCase.handle({
    id,
    currentAuthorId: authorId,
  });

  const result = await postRepo.getById(id);
  assert.isNull(result);
});

test("should throw DeleteNotAuthorizedError when currentAuthorId is not author of the post", async () => {
  await expect(() =>
    useCase.handle({
      id: post.id,
      currentAuthorId: createGuid(),
    }),
  ).rejects.toThrow(DeleteNotAuthorizedError);
});
