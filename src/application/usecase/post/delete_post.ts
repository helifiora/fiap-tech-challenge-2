import type { PostRepo } from "#application/repo/post_repo.ts";
import { BaseError, BaseErrorEnum } from "#domain/error.ts";

type Input = {
  id: string;
  currentAuthorId: string;
};

type Output = void;

export class DeletePost {
  #postRepo: PostRepo;

  constructor(postRepo: PostRepo) {
    this.#postRepo = postRepo;
  }

  async handle(input: Input): Promise<Output> {
    const item = await this.#postRepo.getById(input.id);
    if (item === null) {
      return;
    }

    if (item.authorId !== input.currentAuthorId) {
      throw new DeleteNotAuthorizedError();
    }

    await this.#postRepo.delete(input.id);
  }
}

export class DeleteNotAuthorizedError extends BaseError {
  constructor() {
    super(BaseErrorEnum.authorization, "Not Authorized");
  }
}
