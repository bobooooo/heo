import { NextResponse } from "next/server";
import { unwrapParams } from "@/lib/params";
import { listCommunities } from "@/server/cities";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await unwrapParams(params);
  const communities = await listCommunities(id);
  return NextResponse.json(communities);
}
