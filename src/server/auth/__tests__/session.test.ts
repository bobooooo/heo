import { afterAll, beforeAll, expect, it } from "vitest";
import { prisma } from "../../../lib/prisma";
import {
  deleteSessionByToken,
  getUserBySessionToken,
  newSessionToken,
} from "../session";

let userId = "";
const createdSessionIds: string[] = [];

beforeAll(async () => {
  const user = await prisma.user.create({
    data: { username: `session_${Date.now()}`, password: "test" },
  });
  userId = user.id;
});

it("returns user for active session", async () => {
  const token = newSessionToken();
  const session = await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + 60_000),
    },
  });
  createdSessionIds.push(session.id);

  const user = await getUserBySessionToken(token);
  expect(user?.id).toBe(userId);
});

it("returns null for expired session", async () => {
  const token = newSessionToken();
  const session = await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() - 60_000),
    },
  });
  createdSessionIds.push(session.id);

  const user = await getUserBySessionToken(token);
  expect(user).toBe(null);
});

it("deletes session by token", async () => {
  const token = newSessionToken();
  const session = await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + 60_000),
    },
  });
  createdSessionIds.push(session.id);

  const deletedCount = await deleteSessionByToken(token);
  expect(deletedCount).toBe(1);

  const existing = await prisma.session.findUnique({ where: { token } });
  expect(existing).toBeNull();
});
afterAll(async () => {
  if (createdSessionIds.length) {
    await prisma.session.deleteMany({
      where: { id: { in: createdSessionIds } },
    });
  }
  if (userId) {
    await prisma.user.deleteMany({ where: { id: userId } });
  }
  await prisma.$disconnect();
});
