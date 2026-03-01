import { randomBytes } from "crypto";
import { prisma } from "../../lib/prisma";

export function newSessionToken() {
  return randomBytes(32).toString("hex");
}

export async function getUserBySessionToken(token: string) {
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) return null;

  return session.user;
}

export async function deleteSessionByToken(token: string) {
  if (!token) return 0;
  const result = await prisma.session.deleteMany({ where: { token } });
  return result.count;
}
