import { NextResponse } from "next/server";
import { getRequest } from "@/server/requests";
import { unwrapParams } from "@/lib/params";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await unwrapParams(params);
  const request = await getRequest(id);
  if (!request) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }
  return NextResponse.json(request);
}
