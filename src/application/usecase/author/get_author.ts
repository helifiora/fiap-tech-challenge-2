import type { JwtService } from "#application/jwt_service.ts";
import type { AuthorRepo } from "#application/repo/author_repo.ts";
import { BaseError, BaseErrorEnum } from "#domain/error.ts";

type Input = {
  email: string;
  password: string;
};

type Output = {
  id: string;
  username: string;
  email: string;
  token: string;
};

export class GetAuthor {
  #authorRepo: AuthorRepo;
  #jwtToken: JwtService;

  constructor(authorRepo: AuthorRepo, jwtToken: JwtService) {
    this.#authorRepo = authorRepo;
    this.#jwtToken = jwtToken;
  }

  async handle(input: Input): Promise<Output> {
    const author = await this.#authorRepo.getByEmail(input.email);
    if (author === null) {
      throw new GetAuthorError();
    }

    const isSamePassword = await author.verifyPassword(input.password);
    if (!isSamePassword) {
      throw new GetAuthorError();
    }

    const token = await this.#jwtToken.sign(author);
    return {
      id: author.id,
      token,
      email: author.email,
      username: "",
    };
  }
}

export class GetAuthorError extends BaseError {
  constructor() {
    super(BaseErrorEnum.validation, "Email ou senha incorretos!");
  }
}
