"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type RequestOffer = {
  id: string;
  name: string;
  phone: string;
  wechat: string;
  status: string;
};

export type MyRequest = {
  id: string;
  title: string;
  status: string;
  time: string;
  cityName: string;
  communityName: string;
  offers: RequestOffer[];
};

const statusLabel: Record<string, string> = {
  OPEN: "发布中",
  MATCHED: "待完成",
  COMPLETED: "已完成",
  CANCELED: "已取消",
};

export default function MyRequestsClient({ requests }: { requests: MyRequest[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (url: string) => {
    setError(null);
    setLoadingId(url);
    try {
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error || "操作失败");
        return;
      }
      router.refresh();
    } catch (err) {
      setError("网络错误，请稍后再试");
    } finally {
      setLoadingId(null);
    }
  };

  if (!requests.length) {
    return (
      <div className="rounded-3xl border border-dashed border-[#e7d6c4] bg-white/70 p-10 text-center text-sm text-[#7a6e60]">
        还没有发布过求助。
        <div className="mt-4">
          <Link className="btn-primary" href="/requests/new">
            去发布求助
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
      {requests.map((item) => {
        const selectedOffer = item.offers.find((offer) => offer.status === "SELECTED");
        return (
          <article
            key={item.id}
            className="rounded-3xl border border-white/70 bg-white/80 p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[#2b2620]">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-[#5b5146]">
                  {item.cityName} · {item.communityName} · {new Date(item.time).toLocaleString("zh-CN")}
                </p>
              </div>
              <span className="tag bg-[#2f6f68] text-white">
                {statusLabel[item.status]}
              </span>
            </div>

            {selectedOffer && (
              <div className="mt-4 rounded-2xl border border-white/60 bg-white/70 p-4 text-sm text-[#5b5146]">
                <p className="font-semibold text-[#2b2620]">已选择帮助者</p>
                <p className="mt-2">姓名：{selectedOffer.name}</p>
                <p>电话：{selectedOffer.phone}</p>
                <p>微信：{selectedOffer.wechat}</p>
              </div>
            )}

            {item.offers.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-semibold text-[#2b2620]">
                  帮助申请（{item.offers.length}）
                </p>
                {item.offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-[#5b5146]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#2b2620]">
                          {offer.name}
                        </p>
                        <p>电话：{offer.phone} · 微信：{offer.wechat}</p>
                      </div>
                      {item.status === "OPEN" && offer.status === "PENDING" && (
                        <button
                          className="btn-primary"
                          onClick={() =>
                            handleAction(`/api/offers/${offer.id}/select`)
                          }
                          disabled={loadingId === `/api/offers/${offer.id}/select`}
                        >
                          选择帮助者
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              {item.status === "OPEN" && (
                <button
                  className="btn-ghost"
                  onClick={() => handleAction(`/api/requests/${item.id}/cancel`)}
                  disabled={loadingId === `/api/requests/${item.id}/cancel`}
                >
                  取消求助
                </button>
              )}
              {item.status === "MATCHED" && selectedOffer && (
                <>
                  <button
                    className="btn-primary"
                    onClick={() =>
                      handleAction(`/api/requests/${item.id}/complete`)
                    }
                    disabled={loadingId === `/api/requests/${item.id}/complete`}
                  >
                    标记完成
                  </button>
                  <button
                    className="btn-ghost"
                    onClick={() =>
                      handleAction(`/api/offers/${selectedOffer.id}/cancel-by-owner`)
                    }
                    disabled={
                      loadingId ===
                      `/api/offers/${selectedOffer.id}/cancel-by-owner`
                    }
                  >
                    取消匹配
                  </button>
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
