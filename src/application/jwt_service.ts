import type { Author } from "#domain/model/author.ts";

export interface JwtService {
  sign(content: Author): Promise<string>;

  verify(token: string): Promise<Author>;
}
