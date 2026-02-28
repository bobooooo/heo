import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/require-user";
import { markNotificationRead } from "@/server/notifications";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const note = await markNotificationRead(params.id, user.id);
  if (!note) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }

  return NextResponse.json(note);
}
