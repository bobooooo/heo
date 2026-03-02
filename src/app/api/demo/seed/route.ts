import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/require-user";
import { seedDemoData } from "@/server/demo-seed";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "线上环境禁止生成演示数据" },
      { status: 403 }
    );
  }

  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const summary = await seedDemoData(user.id);
  return NextResponse.json(summary);
}
