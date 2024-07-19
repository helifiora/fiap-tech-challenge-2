import type { PostRepo } from "#application/repo/post_repo.ts";
import type { Post } from "#domain/model/post.ts";

type Input = {
  query?: string;
};

type Output = Post[];

export class GetPosts {
  #postRepo: PostRepo;

  constructor(postRepo: PostRepo) {
    this.#postRepo = postRepo;
  }

  async handle(input: Input = {}): Promise<Output> {
    return await this.#postRepo.getMany({
      query: input.query,
    });
  }
}
