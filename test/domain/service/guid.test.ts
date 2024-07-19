import { assert, test } from "vitest";
import { createGuid } from "#domain/service/guid.ts";
import * as v from "valibot";

test("Generate a valid guid", () => {
  const schema = v.pipe(v.string(), v.uuid());
  const value = createGuid();
  const result = v.safeParse(schema, value);
  assert(result.success);
  assert.equal(result.output, value);
});
