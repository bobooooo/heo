import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newSessionToken } from "@/server/auth/session";
import { createUser } from "@/server/auth/user";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "缺少用户名或密码" }, { status: 400 });
  }

  const user = await createUser(username, password);
  const token = newSessionToken();

  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    },
  });

  const res = NextResponse.json({ id: user.id, username: user.username });
  res.cookies.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
