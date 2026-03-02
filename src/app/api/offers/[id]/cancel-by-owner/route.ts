import { NextResponse } from "next/server";
import { unwrapParams } from "@/lib/params";
import { requireUser } from "@/server/auth/require-user";
import { cancelOfferByOwner } from "@/server/offers";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await unwrapParams(params);
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const offer = await cancelOfferByOwner(id, user.id);
  if (!offer) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  return NextResponse.json(offer);
}
