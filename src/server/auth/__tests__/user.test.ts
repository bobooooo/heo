import { afterAll, expect, it } from "vitest";
import { prisma } from "../../../lib/prisma";
import { createUser, UsernameTakenError } from "../user";

const username = `demo_${Date.now()}`;

it("creates a user", async () => {
  const user = await createUser(username, "secret");
  expect(user.username).toBe(username);
});

it("rejects duplicate usernames", async () => {
  const duplicate = `dup_${Date.now()}`;
  await createUser(duplicate, "secret");

  await expect(createUser(duplicate, "another")).rejects.toBeInstanceOf(
    UsernameTakenError
  );

  await prisma.user.deleteMany({ where: { username: duplicate } });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { username } });
  await prisma.$disconnect();
});
