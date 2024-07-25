import { assert, beforeEach, describe, it } from "vitest";
import { PostUseCaseFactory } from "#application/usecase/post/_factory.ts";
import { GetManyOptions, PostRepo } from "#application/repo/post_repo.ts";
import { Post } from "#domain/model/post.ts";
import { CreatePost } from "#application/usecase/post/create_post.ts";
import { DeletePost } from "#application/usecase/post/delete_post.ts";
import { GetPostById } from "#application/usecase/post/get_post_by_id.ts";
import { GetPosts } from "#application/usecase/post/get_posts.ts";
import { UpdatePost } from "#application/usecase/post/update_post.ts";

class TestPostRepo implements PostRepo {
  delete(id: string): Promise<void> {
    throw "not implemented!";
  }

  getById(id: string): Promise<Post | null> {
    throw "not implemented!";
  }

  getMany(options: GetManyOptions): Promise<Post[]> {
    throw "not implemented!";
  }

  save(model: Post): Promise<void> {
    throw "not implemented!";
  }

  update(model: Post): Promise<void> {
    throw "not implemented!";
  }
}

describe("PostUseCaseFactory", () => {
  let factory: PostUseCaseFactory;

  beforeEach(() => {
    factory = new PostUseCaseFactory(new TestPostRepo());
  });

  it("[createPost] should return an instance of CreatePost", () => {
    const useCase = factory.createPost();
    assert.instanceOf(useCase, CreatePost);
  });

  it("[deletePost] should return an instance of DeletePost", () => {
    const useCase = factory.deletePost();
    assert.instanceOf(useCase, DeletePost);
  });

  it("[getPostById] should return an instance of GetPostById", () => {
    const useCase = factory.getPostById();
    assert.instanceOf(useCase, GetPostById);
  });

  it("[getPosts] should return an instance of GetPosts", () => {
    const useCase = factory.getPosts();
    assert.instanceOf(useCase, GetPosts);
  });

  it("[updatePost] should return an instance of UpdatePost", () => {
    const useCase = factory.updatePost();
    assert.instanceOf(useCase, UpdatePost);
  });
});
