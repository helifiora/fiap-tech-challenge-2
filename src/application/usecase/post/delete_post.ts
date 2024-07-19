import type { PostRepo } from "#application/repo/post_repo.ts";

type Input = { id: string };

type Output = void;

export class DeletePost {
  #postRepo: PostRepo;

  constructor(postRepo: PostRepo) {
    this.#postRepo = postRepo;
  }

  async handle(input: Input): Promise<Output> {
    await this.#postRepo.delete(input.id);
  }
}
