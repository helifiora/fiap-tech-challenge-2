import { createGuid } from "#domain/service/guid.ts";

export class Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  publishedAt: Date;

  private constructor(
    id: string,
    title: string,
    authorId: string,
    content: string,
    publishedAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.authorId = authorId;
    this.publishedAt = publishedAt;
  }

  static create(params: CreateParams): Post {
    const id = createGuid();
    const publishedAt = new Date();
    const { title, authorId, content } = params;
    return new Post(id, title, authorId, content, publishedAt);
  }

  static restore(params: RestoreParams): Post {
    return new Post(
      params.id,
      params.title,
      params.authorId,
      params.content,
      new Date(params.publishedAt),
    );
  }
}

type RestoreParams = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  publishedAt: string;
};

type CreateParams = {
  authorId: string;
  title: string;
  content: string;
};
