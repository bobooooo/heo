import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/require-user";
import { cancelOffer } from "@/server/offers";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const offer = await cancelOffer(params.id, user.id);
  if (!offer) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  return NextResponse.json(offer);
}
