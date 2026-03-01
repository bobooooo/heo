import { cookies } from "next/headers";
import { getUserBySessionToken } from "./session";

const SESSION_COOKIE = "session";

export async function requireUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getUserBySessionToken(token);
}
