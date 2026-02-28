import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/require-user";
import { listNotifications } from "@/server/notifications";

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const notes = await listNotifications(user.id);
  return NextResponse.json(notes);
}
