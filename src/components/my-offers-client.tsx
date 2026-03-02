"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api-base";

export type MyOffer = {
  id: string;
  status: string;
  name: string;
  phone: string;
  wechat: string;
  createdAt: string;
  request: {
    id: string;
    title: string;
    category: string;
    time: string;
    cityName: string;
    communityName: string;
  };
};

const statusLabel: Record<string, string> = {
  PENDING: "申请中",
  SELECTED: "已被选中",
  REJECTED: "已拒绝",
  CANCELED: "已取消",
};

export default function MyOffersClient({ offers }: { offers: MyOffer[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async (offerId: string) => {
    setError(null);
    setLoadingId(offerId);
    try {
      const res = await apiFetch(`/api/offers/${offerId}/cancel`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error || "取消失败");
        return;
      }
      router.refresh();
    } catch (err) {
      setError("网络错误，请稍后再试");
    } finally {
      setLoadingId(null);
    }
  };

  if (!offers.length) {
    return (
      <div className="rounded-3xl border border-dashed border-[#e7d6c4] bg-white/70 p-10 text-center text-sm text-[#7a6e60]">
        还没有帮助记录。
        <div className="mt-4">
          <Link className="btn-primary" href="/">
            去帮助广场看看
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {offers.map((offer) => (
        <article
          key={offer.id}
          className="rounded-3xl border border-white/70 bg-white/80 p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#2b2620]">
                {offer.request.title}
              </h3>
              <p className="mt-1 text-sm text-[#5b5146]">
                {offer.request.cityName} · {offer.request.communityName} ·{" "}
                {new Date(offer.request.time).toLocaleString("zh-CN")}
              </p>
            </div>
            <span className="tag bg-[#d36c44] text-white">
              {statusLabel[offer.status]}
            </span>
          </div>
          {offer.status === "SELECTED" && (
            <div className="mt-4 rounded-2xl border border-white/60 bg-white/70 p-4 text-sm text-[#5b5146]">
              你已被选中，请尽快与发布者线下联系。
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            {(offer.status === "PENDING" || offer.status === "SELECTED") && (
              <button
                className="btn-ghost"
                onClick={() => handleCancel(offer.id)}
                disabled={loadingId === offer.id}
              >
                取消帮助
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
