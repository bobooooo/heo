import { prisma } from "../../lib/prisma";
import { hashPassword, verifyPassword } from "./password";

export async function createUser(username: string, password: string) {
  const hashed = await hashPassword(password);
  return prisma.user.create({ data: { username, password: hashed } });
}

export async function validateUser(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return null;
  const ok = await verifyPassword(password, user.password);
  return ok ? user : null;
}
