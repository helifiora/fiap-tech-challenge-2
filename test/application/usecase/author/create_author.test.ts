import { assert, beforeEach, it, vi } from "vitest";
import { CreateAuthor } from "#application/usecase/author/create_author.ts";
import { AuthorRepo } from "#application/repo/author_repo.ts";
import * as guidModule from "#domain/service/guid.ts";
import { JsonwebtokenJwtService } from "#infrastructure/jsonwebtoken_jwt_service";
import { JwtService } from "#application/jwt_service";

import { randomUUID } from "node:crypto";
import { useDatabaseContainer } from "../../../use_database_container.ts";

let useCase: CreateAuthor;
let authorRepo: AuthorRepo;
let jwtService: JwtService;

beforeEach(async () => {
  const repoFactory = await useDatabaseContainer("create-author");
  authorRepo = repoFactory.authorRepo();

  jwtService = new JsonwebtokenJwtService("batman");
  useCase = new CreateAuthor(authorRepo, jwtService);
});

it("should return id, token when create a valid author", async () => {
  const id = randomUUID();
  vi.spyOn(guidModule, "createGuid").mockReturnValue(id);

  const result = await useCase.handle({
    username: "John Doe",
    email: "johndoe@gmail.com",
    password: "123456",
  });

  assert.equal(result.id, id);

  const jwtResult = await jwtService.verify(result.token);
  assert.equal(jwtResult.username, "John Doe");
  assert.equal(jwtResult.email, "johndoe@gmail.com");
  assert.equal(jwtResult.id, id);
});
