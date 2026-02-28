import { expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../password";

it("hashes and verifies", async () => {
  const hash = await hashPassword("secret");
  const ok = await verifyPassword("secret", hash);
  expect(ok).toBe(true);
});
