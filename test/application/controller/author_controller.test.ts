import { assert, beforeEach, test, expect } from "vitest";
import { AuthorRepo } from "#application/repo/author_repo.ts";
import { JsonwebtokenJwtService } from "#infrastructure/jsonwebtoken_jwt_service";
import { JwtService } from "#application/jwt_service";
import { useDatabaseContainer } from "../../use_database_container.ts";
import { AuthorController } from "#application/controller/author_controller.ts";
import { AuthorUseCaseFactory } from "#application/usecase/author/_factory.ts";
import {
  ControllerInvalidBodyError,
  ControllerRequest,
} from "#application/controller.ts";
import { AuthorUser } from "#domain/model/author.ts";
import { GetAuthorError } from "#application/usecase/author/get_author.ts";

let controller: AuthorController;
let authorRepo: AuthorRepo;
let jwtService: JwtService;

beforeEach(async () => {
  const repoFactory = await useDatabaseContainer("author-controller");
  authorRepo = repoFactory.authorRepo();
  jwtService = new JsonwebtokenJwtService("batman");

  const useCaseFac = new AuthorUseCaseFactory(authorRepo, jwtService);
  controller = new AuthorController(useCaseFac);
});

test("[signUp] should create a new author", async () => {
  const request = new ControllerRequest({
    body: {
      username: "John Doe",
      email: "john@example.com",
      password: "MyPassword@123",
    },
  });

  const response = await controller.signUp(request);
  assert.equal(response.status, 201);

  const responseAuthor = await jwtService.verify(response.content.token);
  assert(responseAuthor.id);
  assert.equal(responseAuthor.email, "john@example.com");
  assert.equal(responseAuthor.username, "John Doe");
});

test.each([1, "mypassword", "MYPASSWORD"])(
  "[signUp] should throw ControllerInvalidBodyError when password is not a valid combination - %s",
  async (value: any) => {
    const request = new ControllerRequest({
      body: {
        username: "John Doe",
        email: "john@example.com",
        password: value,
      },
    });

    expect(() => controller.signUp(request)).rejects.toThrow(
      ControllerInvalidBodyError,
    );
  },
);

test.each([1, ""])(
  "[signUp] should throw ControllerInvalidBodyError when username is not valid - %s",
  async (value: any) => {
    const request = new ControllerRequest({
      body: {
        username: value,
        email: "john@example.com",
        password: "MyPassword",
      },
    });

    expect(() => controller.signUp(request)).rejects.toThrow(
      ControllerInvalidBodyError,
    );
  },
);

test.each([1, "ehli.com"])(
  "[signUp] should throw ControllerInvalidBodyError when email is not valid - %s",
  async (value: any) => {
    const request = new ControllerRequest({
      body: {
        username: "John Doe",
        email: value,
        password: "MyPassword",
      },
    });

    expect(() => controller.signUp(request)).rejects.toThrow(
      ControllerInvalidBodyError,
    );
  },
);

test("[signIn] should return an author", async () => {
  const author = await AuthorUser.create(
    "john@doe.com",
    "John Doe",
    "MyPassword",
  );
  await authorRepo.create(author);

  const request = new ControllerRequest({
    body: {
      email: "john@doe.com",
      password: "MyPassword",
    },
  });

  const response = await controller.signIn(request);
  const responseAuthor = await jwtService.verify(response.content.token);
  assert.equal(response.status, 200);
  assert.equal(responseAuthor.id, author.id);
  assert.equal(responseAuthor.email, author.email);
  assert.equal(responseAuthor.username, author.username);
});

test.each([1, "mypassword", "MYPASSWORD"])(
  "[signIn] should throw ControllerInvalidBodyError when password is not valid",
  async (value: any) => {
    const request = new ControllerRequest({
      body: {
        email: "john@doe.com",
        password: value,
      },
    });

    expect(() => controller.signIn(request)).rejects.toThrow(
      ControllerInvalidBodyError,
    );
  },
);

test.each([1, "ehli.com"])(
  "[signIn] should throw ControllerInvalidBodyError when email is not valid",
  async (value: any) => {
    const request = new ControllerRequest({
      body: {
        email: value,
        password: "MyPassword",
      },
    });

    expect(() => controller.signIn(request)).rejects.toThrow(
      ControllerInvalidBodyError,
    );
  },
);

test("[signIn] should throw GetAuthorError when author does not exists in database", async () => {
  const request = new ControllerRequest({
    body: {
      email: "john@doe.com",
      password: "MyPassword",
    },
  });

  expect(() => controller.signIn(request)).rejects.toThrow(GetAuthorError);
});

test("[signIn] should throw GetAuthorError when author does exists in database but password does not match", async () => {
  const author = await AuthorUser.create(
    "john@doe.com",
    "John Doe",
    "MyPassword",
  );

  await authorRepo.create(author);

  const request = new ControllerRequest({
    body: {
      email: "john@doe.com",
      password: "MyPassword2",
    },
  });

  expect(() => controller.signIn(request)).rejects.toThrow(GetAuthorError);
});
