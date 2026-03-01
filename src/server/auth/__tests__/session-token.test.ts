import { expect, it } from "vitest";
import { readSessionToken } from "../session-token";

it("reads token from async cookies", async () => {
  const token = await readSessionToken(
    Promise.resolve({
      get: (name: string) => (name === "session" ? { value: "abc" } : undefined),
    })
  );

  expect(token).toBe("abc");
});

it("returns null when token missing", async () => {
  const token = await readSessionToken(
    Promise.resolve({
      get: () => undefined,
    })
  );

  expect(token).toBe(null);
});
