import { afterAll, expect, it } from "vitest";
import { prisma } from "../../../lib/prisma";
import { createUser } from "../user";

const username = `demo_${Date.now()}`;

it("creates a user", async () => {
  const user = await createUser(username, "secret");
  expect(user.username).toBe(username);
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { username } });
  await prisma.$disconnect();
});
