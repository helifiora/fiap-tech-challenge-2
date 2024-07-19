import type { AuthorUser } from "#domain/model/author.ts";

export interface AuthorRepo {
  create(author: AuthorUser): Promise<void>;

  getByEmail(email: string): Promise<AuthorUser | null>;
}
