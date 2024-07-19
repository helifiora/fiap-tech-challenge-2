import type { AuthorRepo } from "#application/repo/author_repo.ts";
import type { JwtService } from "#application/jwt_service.ts";
import { AuthorUser } from "#domain/model/author.ts";

type Input = {
  email: string;
  username: string;
  password: string;
};

type Output = {
  id: string;
  token: string;
};

export class CreateAuthor {
  #authorRepo: AuthorRepo;
  #jwtToken: JwtService;

  constructor(authorRepo: AuthorRepo, jwtToken: JwtService) {
    this.#authorRepo = authorRepo;
    this.#jwtToken = jwtToken;
  }

  async handle(input: Input): Promise<Output> {
    const author = await AuthorUser.create(
      input.email,
      input.username,
      input.password,
    );

    await this.#authorRepo.create(author);
    const token = await this.#jwtToken.sign(author);
    return {
      id: author.id,
      token,
    };
  }
}
