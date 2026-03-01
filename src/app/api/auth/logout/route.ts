import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deleteSessionByToken } from "@/server/auth/session";
import { readSessionToken } from "@/server/auth/session-token";

export async function POST() {
  const token = await readSessionToken(cookies());
  if (token) {
    await deleteSessionByToken(token);
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
