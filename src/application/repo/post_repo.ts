import type { Post } from "#domain/model/post.ts";

export interface PostRepo {
  delete(id: string): Promise<void>;
  getMany(options: GetManyOptions): Promise<Post[]>;
  getById(id: string): Promise<Post | null>;
  save(model: Post): Promise<void>;
  update(model: Post): Promise<void>;
}

export type GetManyOptions = { query?: string };
