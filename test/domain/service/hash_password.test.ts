import { assert, test } from "vitest";

import {
  verifyPassword,
  createPassword,
} from "#domain/service/hash_password.ts";

test("should create and verify password with a correct hash", async () => {
  const validPassword = "1234";
  const invalidPassword = "12345";

  const hash = await createPassword(validPassword);
  assert(await verifyPassword(hash, validPassword));
  assert(!(await verifyPassword(hash, invalidPassword)));
});
