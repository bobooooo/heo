"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api-base";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("请输入用户名和密码");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data?.error || "登录失败");
        return;
      }

      router.push("/");
    } catch (err) {
      setError("网络错误，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
          登录
        </p>
        <h2 className="font-display text-3xl text-[#2b2620]">欢迎回来</h2>
        <p className="mt-2 text-sm text-[#5b5146]">
          继续查看邻里互助的最新动态。
        </p>
      </div>

      <form className="flex flex-1 flex-col gap-4" onSubmit={handleSubmit}>
        <label className="text-sm text-[#5b5146]">
          用户名
          <input
            className="input-field mt-2"
            placeholder="输入用户名"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label className="text-sm text-[#5b5146]">
          密码
          <input
            type="password"
            className="input-field mt-2"
            placeholder="输入密码"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error && (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <button type="submit" className="btn-primary mt-2" disabled={loading}>
          {loading ? "正在登录..." : "登录进入"}
        </button>
      </form>

      <div className="mt-6 text-sm text-[#7a6e60]">
        还没有账号？
        <Link href="/register" className="ml-2 font-semibold text-[#2f6f68]">
          去注册
        </Link>
      </div>
    </div>
  );
}
