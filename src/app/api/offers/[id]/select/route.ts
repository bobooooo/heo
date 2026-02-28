import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/server/auth/require-user";
import { selectOffer } from "@/server/offers";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const offer = await prisma.helpOffer.findUnique({ where: { id: params.id } });
  if (!offer) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }

  const result = await selectOffer(offer.requestId, offer.id, user.id);
  if (!result) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  return NextResponse.json(result);
}
