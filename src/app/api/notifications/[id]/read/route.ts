import { NextResponse } from "next/server";
import { unwrapParams } from "@/lib/params";
import { requireUser } from "@/server/auth/require-user";
import { markNotificationRead } from "@/server/notifications";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await unwrapParams(params);
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const note = await markNotificationRead(id, user.id);
  if (!note) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }

  return NextResponse.json(note);
}
