import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/require-user";
import { completeRequest } from "@/server/requests";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const request = await completeRequest(params.id, user.id);
  if (!request) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  return NextResponse.json(request);
}
