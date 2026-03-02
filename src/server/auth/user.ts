import { prisma } from "../../lib/prisma";
import { hashPassword, verifyPassword } from "./password";

export class UsernameTakenError extends Error {
  constructor() {
    super("USERNAME_TAKEN");
  }
}

export async function createUser(username: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    throw new UsernameTakenError();
  }
  const hashed = await hashPassword(password);
  try {
    return await prisma.user.create({ data: { username, password: hashed } });
  } catch (error) {
    if (
      typeof error === "object" &&
      error &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      throw new UsernameTakenError();
    }
    throw error;
  }
}

export async function validateUser(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return null;
  const ok = await verifyPassword(password, user.password);
  return ok ? user : null;
}
