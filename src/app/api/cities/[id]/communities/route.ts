import { NextResponse } from "next/server";
import { listCommunities } from "@/server/cities";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const communities = await listCommunities(params.id);
  return NextResponse.json(communities);
}
