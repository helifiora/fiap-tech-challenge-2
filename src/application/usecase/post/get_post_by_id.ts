import type { PostRepo } from "#application/repo/post_repo.ts";

type Input = { id: string };

type Output = {
  id: string;
  title: string;
  content: string;
  publishedAt: Date;
  authorId: string;
} | null;

export class GetPostById {
  #postRepo: PostRepo;

  constructor(postRepo: PostRepo) {
    this.#postRepo = postRepo;
  }

  async handle(input: Input): Promise<Output> {
    return this.#postRepo.getById(input.id);
  }
}
