import type { PostRepo } from "#application/repo/post_repo.ts";
import { BaseError, BaseErrorEnum } from "#domain/error.ts";

type Input = {
  id: string;
  title: string;
  content: string;
  currentAuthorId: string;
};

type Output = {
  id: string;
  title: string;
  content: string;
  publishedAt: Date;
  authorId: string;
};

export class UpdatePost {
  #postRepo: PostRepo;

  constructor(postRepo: PostRepo) {
    this.#postRepo = postRepo;
  }

  async handle(input: Input): Promise<Output> {
    const post = await this.#postRepo.getById(input.id);
    if (post === null) {
      throw new NotFoundPostError();
    }

    if (post.authorId !== input.currentAuthorId) {
      throw new NotSameAuthorError();
    }

    post.content = input.content;
    post.title = input.title;

    await this.#postRepo.update(post);
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      publishedAt: post.publishedAt,
    };
  }
}

export class NotFoundPostError extends BaseError {
  constructor() {
    super(BaseErrorEnum.validation, "Postagem não existe");
  }
}

export class NotSameAuthorError extends BaseError {
  constructor() {
    super(BaseErrorEnum.authorization, "Não autorizado!");
  }
}
