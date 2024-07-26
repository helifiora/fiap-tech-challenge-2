import { assert, beforeEach, it, expect, inject, afterEach } from "vitest";
import { AuthorRepo } from "#application/repo/author_repo.ts";
import { AuthorUser } from "#domain/model/author.ts";
import {
  GetAuthor,
  GetAuthorError,
} from "#application/usecase/author/get_author.ts";
import { JwtService } from "#application/jwt_service.ts";
import { JsonwebtokenJwtService } from "#infrastructure/jsonwebtoken_jwt_service.ts";
import { KyselyMigrator } from "#infrastructure/kysely_migrator.ts";
import { KyselyDatabase } from "#infrastructure/kysely_db.ts";
import { KyselyAuthorRepo } from "#infrastructure/repo_adapter/kysely_author_repository.ts";
import { setupKyselyDb } from "test/setup_kysely_db.ts";
import { randomEmail } from "test/utils";

let useCase: GetAuthor;
let authorRepo: AuthorRepo;
let jwtService: JwtService;
let migrator: KyselyMigrator;
let db: KyselyDatabase;
let author: AuthorUser;

beforeEach(async () => {
  const secret = inject("secret");
  const connectionDb = inject("container");

  [db, migrator] = await setupKyselyDb(connectionDb);
  await migrator.toLatest();
  authorRepo = new KyselyAuthorRepo(db);
  jwtService = new JsonwebtokenJwtService(secret);
  useCase = new GetAuthor(authorRepo, jwtService);

  author = await AuthorUser.create(randomEmail(), "John Doe", "robin");

  authorRepo.create(author);
});

afterEach(async () => {
  await migrator.toInitial();
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
