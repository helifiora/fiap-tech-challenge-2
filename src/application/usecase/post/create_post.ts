import type { PostRepo } from "#application/repo/post_repo.ts";
import { Post } from "#domain/model/post.ts";

type Input = {
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

export class CreatePost {
  #postRepo: PostRepo;

  constructor(postRepo: PostRepo) {
    this.#postRepo = postRepo;
  }

  async handle(input: Input): Promise<Output> {
    const post = Post.create({
      title: input.title,
      content: input.content,
      authorId: input.currentAuthorId,
    });

    await this.#postRepo.save(post);
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      publishedAt: post.publishedAt,
    };
  }
}
