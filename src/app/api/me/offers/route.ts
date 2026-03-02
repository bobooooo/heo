import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/require-user";
import { listOffersByUser } from "@/server/offers";

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const offers = await listOffersByUser(user.id);
  const serializable = offers.map((offer) => ({
    id: offer.id,
    status: offer.status,
    name: offer.name,
    phone: offer.phone,
    wechat: offer.wechat,
    createdAt: offer.createdAt.toISOString(),
    request: {
      id: offer.request.id,
      title: offer.request.title,
      category: offer.request.category,
      time: offer.request.time.toISOString(),
      cityName: offer.request.city.name,
      communityName: offer.request.community.name,
    },
  }));

  return NextResponse.json(serializable);
}
