import { assert, test } from "vitest";
import { Author, AuthorUser } from "#domain/model/author.ts";
import { createGuid } from "#domain/service/guid.ts";
import { verifyPassword } from "#domain/service/hash_password.ts";

test("should create a new Author Instance", () => {
  const id = createGuid();
  const author = new Author(id, "email@email.com", "Helifiora!");
  assert.equal(id, author.id);
  assert.equal(author.username, "Helifiora!");
  assert.equal(author.email, "email@email.com");
});

test("[create] should create a new instance of AuthorUser", async () => {
  const author = await AuthorUser.create(
    "email@email.com",
    "Helifiora!",
    "123",
  );

  assert.equal(author.username, "Helifiora!");
  assert.equal(author.email, "email@email.com");
});

test("[verifyPassword] should validate if password match with hash", async () => {
  const author = await AuthorUser.create(
    "email@email.com",
    "Helifiora!",
    "123",
  );

  assert(await author.verifyPassword("123"));
  assert(await verifyPassword(author.passwordHash, "123"));
});
