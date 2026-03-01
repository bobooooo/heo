import MyOffersClient from "@/components/my-offers-client";
import { requireUser } from "@/server/auth/require-user";
import { listOffersByUser } from "@/server/offers";

export default async function MyOffersPage() {
  const user = await requireUser();
  if (!user) return null;

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

  return (
    <div className="paper-card p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
          我的帮助
        </p>
        <h2 className="font-display text-3xl text-[#2b2620]">帮助记录</h2>
      </div>

      <MyOffersClient offers={serializable} />
    </div>
  );
}
