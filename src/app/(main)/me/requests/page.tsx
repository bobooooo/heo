import MyRequestsClient from "@/components/my-requests-client";
import { requireUser } from "@/server/auth/require-user";
import { listRequestsByUser } from "@/server/requests";

export default async function MyRequestsPage() {
  const user = await requireUser();
  if (!user) return null;

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

  return (
    <div className="paper-card p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
          我的求助
        </p>
        <h2 className="font-display text-3xl text-[#2b2620]">管理发布</h2>
      </div>

      <MyRequestsClient requests={serializable} />
    </div>
  );
}
