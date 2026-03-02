import { expect, it } from "vitest";
import { unwrapParams } from "../params";

it("unwraps promise params", async () => {
  const result = await unwrapParams(Promise.resolve({ id: "abc" }));
  expect(result.id).toBe("abc");
});
