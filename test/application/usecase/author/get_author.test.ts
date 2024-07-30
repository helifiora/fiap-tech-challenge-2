import { assert, beforeEach, it, expect } from "vitest";
import { AuthorRepo } from "#application/repo/author_repo.ts";
import { AuthorUser } from "#domain/model/author.ts";
import {
  GetAuthor,
  GetAuthorError,
} from "#application/usecase/author/get_author.ts";
import { JwtService } from "#application/jwt_service.ts";
import { JsonwebtokenJwtService } from "#infrastructure/jsonwebtoken_jwt_service.ts";
import { useDatabaseContainer } from "../../../use_database_container.ts";

let useCase: GetAuthor;
let authorRepo: AuthorRepo;
let jwtService: JwtService;
let author: AuthorUser;

beforeEach(async () => {
  const repoFac = await useDatabaseContainer("get-author");

  authorRepo = repoFac.authorRepo();

  jwtService = new JsonwebtokenJwtService("batman");
  useCase = new GetAuthor(authorRepo, jwtService);

  author = await AuthorUser.create("johndoe@gmail.com", "John Doe", "robin");

  await authorRepo.create(author);
});

it("should return author with token when repo has data", async () => {
  const result = await useCase.handle({
    email: author.email,
    password: "robin",
  });

  assert(result);
  assert.equal(result.id, author.id);
  assert.equal(result.email, author.email);
  assert.equal(result.username, "John Doe");

  const jwtResult = await jwtService.verify(result.token);
  assert.equal(result.id, jwtResult.id);
  assert.equal(result.email, jwtResult.email);
  assert.equal(result.username, jwtResult.username);
});

it("should throw GetAuthorError when password is incorrect", async () => {
  const payload = {
    email: author.email,
    password: "batman",
  };

  expect(useCase.handle(payload)).rejects.toThrow(GetAuthorError);
});

it("should throw GetAuthorError when email is incorrect", async () => {
  const payload = {
    email: "doe@email.com",
    password: "robin",
  };

  expect(useCase.handle(payload)).rejects.toThrow(GetAuthorError);
});
