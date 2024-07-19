import type { PostRepo } from "#application/repo/post_repo.ts";

import { GetPosts } from "./get_posts.ts";
import { CreatePost } from "./create_post.ts";
import { DeletePost } from "./delete_post.ts";
import { GetPostById } from "./get_post_by_id.ts";
import { UpdatePost } from "./update_post.ts";

export class PostUseCaseFactory {
  #postRepo: PostRepo;

  constructor(postRepo: PostRepo) {
    this.#postRepo = postRepo;
  }

  createPost(): CreatePost {
    return new CreatePost(this.#postRepo);
  }

  deletePost(): DeletePost {
    return new DeletePost(this.#postRepo);
  }

  getPosts(): GetPosts {
    return new GetPosts(this.#postRepo);
  }

  getPostById(): GetPostById {
    return new GetPostById(this.#postRepo);
  }

  updatePost(): UpdatePost {
    return new UpdatePost(this.#postRepo);
  }
}
