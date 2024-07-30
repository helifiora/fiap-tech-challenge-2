import { assert, beforeEach, test } from "vitest";
import { AuthorUseCaseFactory } from "#application/usecase/author/_factory.ts";
import { AuthorRepo } from "#application/repo/author_repo.ts";
import { Author, AuthorUser } from "#domain/model/author.ts";
import { JwtService } from "#application/jwt_service.ts";
import { CreateAuthor } from "#application/usecase/author/create_author.ts";
import { GetAuthor } from "#application/usecase/author/get_author.ts";

let factory: AuthorUseCaseFactory;

beforeEach(() => {
  factory = new AuthorUseCaseFactory(
    new TestAuthorRepo(),
    new TestJwtService(),
  );
});

test("[createAuthor] should return an instance of CreateAuthor", () => {
  const useCase = factory.createAuthor();
  assert.instanceOf(useCase, CreateAuthor);
});

test("[getAuthor] should return an instance of GetAuthor", () => {
  const useCase = factory.getAuthor();
  assert.instanceOf(useCase, GetAuthor);
});

class TestAuthorRepo implements AuthorRepo {
  create(author: AuthorUser): Promise<void> {
    throw "not implemented!";
  }

  getByEmail(email: string): Promise<AuthorUser | null> {
    throw "not implemented";
  }
}

class TestJwtService implements JwtService {
  sign(content: Author): Promise<string> {
    throw "not implemented";
  }

  verify(token: string): Promise<Author> {
    throw "not implemented";
  }
}
