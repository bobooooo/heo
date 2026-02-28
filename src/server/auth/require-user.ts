import { cookies } from "next/headers";
import { prisma } from "../../lib/prisma";

const SESSION_COOKIE = "session";

export async function requireUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) return null;

  return session.user;
}
