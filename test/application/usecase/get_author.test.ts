import { assert, beforeEach, describe, it, expect } from "vitest";
import { AuthorRepo } from "#application/repo/author_repo.ts";
import { Author, AuthorUser } from "#domain/model/author.ts";
import {
  GetAuthor,
  GetAuthorError,
} from "#application/usecase/author/get_author.ts";
import { createPassword } from "#domain/service/hash_password.ts";
import { JwtService } from "#application/jwt_service.ts";

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

describe("GetAuthor", () => {
  let useCase: GetAuthor;
  let authorRepo: TestAuthorRepo;

  beforeEach(async () => {
    authorRepo = new TestAuthorRepo();
    useCase = new GetAuthor(authorRepo, new TestJwtService());

    const hashedPassword = await createPassword("robin");

    authorRepo.data.set(
      "john@email.com",
      new AuthorUser(
        "oi-oi-oi-oi",
        "john@email.com",
        "John Doe",
        hashedPassword,
      ),
    );
  });

  it("should return author with token when repo has data", async () => {
    const result = await useCase.handle({
      email: "john@email.com",
      password: "robin",
    });

    assert(result);
    assert.equal(result.id, "oi-oi-oi-oi");
    assert.equal(result.email, "john@email.com");
    assert.equal(result.username, "John Doe");
    assert.equal(result.token, "jwt-token-oi-oi-oi-oi-john@email.com");
  });

  it("should throw GetAuthorError when password is incorrect", async () => {
    const payload = {
      email: "john@email.com",
      password: "batman",
    };

    expect(useCase.handle(payload)).rejects.toThrow(GetAuthorError);
  });

  it("should throw GetAuthorError when password is incorrect", async () => {
    const payload = {
      email: "doe@email.com",
      password: "robin",
    };

    expect(useCase.handle(payload)).rejects.toThrow(GetAuthorError);
  });
});
