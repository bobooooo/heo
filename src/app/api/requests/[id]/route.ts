import { NextResponse } from "next/server";
import { getRequest } from "@/server/requests";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const request = await getRequest(params.id);
  if (!request) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }
  return NextResponse.json(request);
}
