import { assert, test } from "vitest";
import { BaseError, BaseErrorEnum } from "#domain/error.ts";

class FakeError extends BaseError {
  constructor() {
    super(BaseErrorEnum.authorization, "Jovem");
  }
}

test("should verify BaseError instance", () => {
  const t: Error = new FakeError();
  assert(BaseError.isInstance(t));
});
