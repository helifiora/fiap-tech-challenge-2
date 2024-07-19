import type { JwtService } from "#application/jwt_service.ts";
import type { AuthorRepo } from "#application/repo/author_repo.ts";

import { GetAuthor } from "./get_author.ts";
import { CreateAuthor } from "./create_author.ts";

export class AuthorUseCaseFactory {
  #authorRepo: AuthorRepo;
  #jwtService: JwtService;

  constructor(authorRepo: AuthorRepo, jwtService: JwtService) {
    this.#authorRepo = authorRepo;
    this.#jwtService = jwtService;
  }

  createAuthor(): CreateAuthor {
    return new CreateAuthor(this.#authorRepo, this.#jwtService);
  }

  getAuthor(): GetAuthor {
    return new GetAuthor(this.#authorRepo, this.#jwtService);
  }
}
