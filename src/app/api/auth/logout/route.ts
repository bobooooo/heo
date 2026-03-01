import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionToken } from "@/server/auth/session-token";

export async function POST() {
  const token = await readSessionToken(cookies());
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
  return res;
}
