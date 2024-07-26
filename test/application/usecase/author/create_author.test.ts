import { afterEach, assert, beforeEach, inject, it, vi } from "vitest";
import { CreateAuthor } from "#application/usecase/author/create_author.ts";
import { AuthorRepo } from "#application/repo/author_repo.ts";
import * as guidModule from "#domain/service/guid.ts";
import { KyselyAuthorRepo } from "#infrastructure/repo_adapter/kysely_author_repository";
import { KyselyDatabase } from "#infrastructure/kysely_db";
import { KyselyMigrator } from "#infrastructure/kysely_migrator";
import { JsonwebtokenJwtService } from "#infrastructure/jsonwebtoken_jwt_service";
import { JwtService } from "#application/jwt_service";
import { setupKyselyDb } from "test/setup_kysely_db";
import { randomEmail } from "test/utils.ts";
import { randomUUID } from "node:crypto";

let useCase: CreateAuthor;
let authorRepo: AuthorRepo;
let db: KyselyDatabase;
let migrator: KyselyMigrator;
let jwtService: JwtService;

beforeEach(async () => {
  const secret = inject("secret");
  const connectionDb = inject("container");

  [db, migrator] = await setupKyselyDb(connectionDb);
  await migrator.toLatest();

  authorRepo = new KyselyAuthorRepo(db);
  jwtService = new JsonwebtokenJwtService(secret);
  useCase = new CreateAuthor(authorRepo, jwtService);
});

afterEach(async () => {
  await migrator.toInitial();
});

it("should return id, token when create a valid author", async () => {
  const id = randomUUID();
  vi.spyOn(guidModule, "createGuid").mockReturnValue(id);

  const email = randomEmail();

  const result = await useCase.handle({
    username: "John Doe",
    email,
    password: "123456",
  });

  assert.equal(result.id, id);

  const jwtResult = await jwtService.verify(result.token);
  assert.equal(jwtResult.username, "John Doe");
  assert.equal(jwtResult.email, email);
  assert.equal(jwtResult.id, id);
});
