"use client";

import { useEffect, useState } from "react";

type Profile = {
  name: string;
  phone: string;
  wechat: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    phone: "",
    wechat: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) return;
      const data = await res.json();
      setProfile({
        name: data?.name ?? "",
        phone: data?.phone ?? "",
        wechat: data?.wechat ?? "",
      });
    };

    loadProfile();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    if (res.ok) {
      setMessage("资料已更新");
    } else {
      setMessage("更新失败，请稍后再试");
    }

    setLoading(false);
  };

  return (
    <div className="paper-card p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
          我的资料
        </p>
        <h2 className="font-display text-3xl text-[#2b2620]">个人联系方式</h2>
        <p className="mt-2 text-sm text-[#5b5146]">
          完善资料后，帮助时会自动带出你的联系方式。
        </p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="text-sm text-[#5b5146]">
          姓名
          <input
            className="input-field mt-2"
            value={profile.name}
            onChange={(event) =>
              setProfile((prev) => ({ ...prev, name: event.target.value }))
            }
          />
        </label>
        <label className="text-sm text-[#5b5146]">
          电话
          <input
            className="input-field mt-2"
            value={profile.phone}
            onChange={(event) =>
              setProfile((prev) => ({ ...prev, phone: event.target.value }))
            }
          />
        </label>
        <label className="text-sm text-[#5b5146]">
          微信
          <input
            className="input-field mt-2"
            value={profile.wechat}
            onChange={(event) =>
              setProfile((prev) => ({ ...prev, wechat: event.target.value }))
            }
          />
        </label>
        {message && (
          <p className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-[#5b5146]">
            {message}
          </p>
        )}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "正在保存..." : "保存资料"}
        </button>
      </form>
    </div>
  );
}
