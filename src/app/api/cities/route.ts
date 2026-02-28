import { NextResponse } from "next/server";
import { listCities } from "@/server/cities";

export async function GET() {
  const cities = await listCities();
  return NextResponse.json(cities);
}
