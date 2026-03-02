"use client";

import { useState } from "react";

type SeedSummary = {
  users: number;
  requests: number;
  offers: number;
  accounts: { username: string; password: string }[];
};

export default function DemoSeedPanel() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SeedSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/demo/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "生成失败");
        return;
      }
      setSummary(data);
    } catch (err) {
      setError("网络错误，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button className="btn-primary w-full" onClick={handleSeed} disabled={loading}>
        {loading ? "正在生成..." : "生成/重置演示数据"}
      </button>
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {summary && (
        <div className="rounded-2xl border border-white/70 bg-white/80 p-4 text-sm text-[#5b5146]">
          <p>
            已生成 {summary.requests} 条求助、{summary.offers} 条帮助申请。
          </p>
          <p className="mt-2 font-semibold text-[#2b2620]">演示账号</p>
          <ul className="mt-2 space-y-1">
            {summary.accounts.map((account) => (
              <li key={account.username}>
                {account.username} / {account.password}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
