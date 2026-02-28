import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/require-user";
import { createRequest, listRequests } from "@/server/requests";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cityId = searchParams.get("cityId") ?? undefined;
  const communityId = searchParams.get("communityId") ?? undefined;
  const status = searchParams.get("status") ?? undefined;

  const requests = await listRequests({
    cityId,
    communityId,
    status: status as "OPEN" | "MATCHED" | "COMPLETED" | "CANCELED" | undefined,
  });
  return NextResponse.json(requests);
}

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const body = await req.json();
  const request = await createRequest(user.id, {
    cityId: body.cityId,
    communityId: body.communityId,
    time: body.time,
    title: body.title,
    category: body.category,
    detail: body.detail,
    contactPhone: body.contactPhone,
    contactWechat: body.contactWechat,
  });

  return NextResponse.json(request);
}
