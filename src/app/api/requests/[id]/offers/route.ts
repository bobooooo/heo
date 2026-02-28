import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/server/auth/require-user";
import { createOffer } from "@/server/offers";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const request = await prisma.helpRequest.findUnique({
    where: { id: params.id },
  });
  if (!request) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }
  if (request.userId === user.id) {
    return NextResponse.json({ error: "不能帮助自己" }, { status: 403 });
  }
  if (request.status !== "OPEN") {
    return NextResponse.json({ error: "求助不可申请" }, { status: 400 });
  }

  const body = await req.json();
  const name = body?.name?.trim();
  const phone = body?.phone?.trim();
  const wechat = body?.wechat?.trim();

  if (!name || !phone || !wechat) {
    return NextResponse.json({ error: "联系方式必填" }, { status: 400 });
  }

  const offer = await createOffer(params.id, user.id, { name, phone, wechat });
  return NextResponse.json(offer);
}
