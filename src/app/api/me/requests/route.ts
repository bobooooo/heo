import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/require-user";
import { listRequestsByUser } from "@/server/requests";

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const requests = await listRequestsByUser(user.id);
  const serializable = requests.map((request) => ({
    id: request.id,
    title: request.title,
    status: request.status,
    time: request.time.toISOString(),
    cityName: request.city.name,
    communityName: request.community.name,
    offers: request.offers.map((offer) => ({
      id: offer.id,
      name: offer.name,
      phone: offer.phone,
      wechat: offer.wechat,
      status: offer.status,
    })),
  }));

  return NextResponse.json(serializable);
}
