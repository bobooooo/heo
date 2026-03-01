import { cookies } from "next/headers";
import { getUserBySessionToken } from "./session";
import { readSessionToken } from "./session-token";

export async function requireUser() {
  const token = await readSessionToken(cookies());
  if (!token) return null;
  return getUserBySessionToken(token);
}
