"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NotificationItem = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
  readAt: string | null;
};

const typeLabel: Record<string, string> = {
  offer_submitted: "收到新的帮助申请",
  offer_selected: "你被选为帮助者",
  offer_rejected: "你的帮助申请被婉拒",
  offer_canceled: "帮助者取消了申请",
  offer_canceled_by_owner: "发布者取消了匹配",
  request_canceled: "求助已取消",
  request_completed: "求助赢得完成",
};

export default function NotificationsClient() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(
        data.map((note: NotificationItem) => ({
          ...note,
          createdAt: note.createdAt,
        }))
      );
    } catch (err) {
      setError("通知加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: "POST" });
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, readAt: new Date().toISOString() } : item))
    );
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-dashed border-[#e7d6c4] bg-white/70 p-10 text-center text-sm text-[#7a6e60]">
        正在加载通知...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-[#e7d6c4] bg-white/70 p-10 text-center text-sm text-[#7a6e60]">
        暂无通知。
        <div className="mt-4">
          <Link className="btn-primary" href="/">
            去帮助广场看看
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((note) => (
        <article
          key={note.id}
          className="rounded-3xl border border-white/70 bg-white/80 p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-[#2b2620]">
              {typeLabel[note.type] ?? "系统通知"}
            </h3>
            <span className="text-xs text-[#7a6e60]">
              {new Date(note.createdAt).toLocaleString("zh-CN")}
            </span>
          </div>
          <p className="mt-2 text-sm text-[#5b5146]">
            相关求助：{(note.payload as { requestId?: string })?.requestId ?? "-"}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="btn-ghost" onClick={() => markRead(note.id)}>
              {note.readAt ? "已读" : "标记已读"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
