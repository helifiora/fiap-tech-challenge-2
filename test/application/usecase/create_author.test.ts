import { assert, beforeEach, describe, it, vi } from "vitest";
import { CreateAuthor } from "#application/usecase/author/create_author.ts";
import { AuthorRepo } from "#application/repo/author_repo.ts";
import { Author, AuthorUser } from "#domain/model/author.ts";
import { JwtService } from "#application/jwt_service.ts";
import * as guidModule from "#domain/service/guid.ts";

class TestAuthorRepo implements AuthorRepo {
  data: Map<string, AuthorUser> = new Map();

  async create(author: AuthorUser): Promise<void> {
    this.data.set(author.email, author);
  }

  async getByEmail(email: string): Promise<AuthorUser | null> {
    return this.data.get(email) ?? null;
  }
}

class TestJwtService implements JwtService {
  async sign(content: Author): Promise<string> {
    return `jwt-token-${content.id}-${content.email}`;
  }

  verify(token: string): Promise<Author> {
    throw "";
  }
}

describe("CreateAuthor", () => {
  let useCase: CreateAuthor;
  let authorRepo: TestAuthorRepo;

  beforeEach(() => {
    authorRepo = new TestAuthorRepo();
    useCase = new CreateAuthor(authorRepo, new TestJwtService());
  });

  it("should return id, token when create a valid author", async () => {
    vi.spyOn(guidModule, "createGuid").mockReturnValue("oi-oi-oi-oi");

    const result = await useCase.handle({
      username: "John Doe",
      email: "john@doe.com",
      password: "123456",
    });

    assert.equal(result.id, "oi-oi-oi-oi");
    assert.equal(result.token, "jwt-token-oi-oi-oi-oi-john@doe.com");
  });
});
