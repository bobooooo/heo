import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/require-user";
import { getProfile, updateProfile } from "@/server/profile";

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const profile = await getProfile(user.id);
  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const body = await req.json();
  const profile = await updateProfile(user.id, {
    name: body?.name ?? null,
    phone: body?.phone ?? null,
    wechat: body?.wechat ?? null,
  });

  return NextResponse.json(profile);
}
