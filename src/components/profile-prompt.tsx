"use client";

import { useEffect, useState } from "react";

type Profile = {
  name: string | null;
  phone: string | null;
  wechat: string | null;
};

export default function ProfilePrompt() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) return;
        const data = await res.json();
        setProfile({
          name: data?.name ?? "",
          phone: data?.phone ?? "",
          wechat: data?.wechat ?? "",
        });
        const incomplete = !data?.name || !data?.phone || !data?.wechat;
        setOpen(incomplete);
      } catch (err) {
        setOpen(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setError(null);

    if (!profile.name || !profile.phone || !profile.wechat) {
      setError("请填写姓名、电话与微信");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error || "保存失败");
        return;
      }
      setOpen(false);
    } catch (err) {
      setError("网络错误，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-10">
      <div className="paper-card w-full max-w-lg p-8">
        <h3 className="font-display text-2xl text-[#2b2620]">完善个人资料</h3>
        <p className="mt-2 text-sm text-[#5b5146]">
          帮助前需要填写联系方式，方便发布者与你线下联系。
        </p>
        <div className="mt-6 space-y-4">
          <label className="text-sm text-[#5b5146]">
            姓名
            <input
              className="input-field mt-2"
              value={profile.name ?? ""}
              onChange={(event) =>
                setProfile((prev) =>
                  prev ? { ...prev, name: event.target.value } : prev
                )
              }
            />
          </label>
          <label className="text-sm text-[#5b5146]">
            电话
            <input
              className="input-field mt-2"
              value={profile.phone ?? ""}
              onChange={(event) =>
                setProfile((prev) =>
                  prev ? { ...prev, phone: event.target.value } : prev
                )
              }
            />
          </label>
          <label className="text-sm text-[#5b5146]">
            微信
            <input
              className="input-field mt-2"
              value={profile.wechat ?? ""}
              onChange={(event) =>
                setProfile((prev) =>
                  prev ? { ...prev, wechat: event.target.value } : prev
                )
              }
            />
          </label>
        </div>
        {error && (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "正在保存..." : "保存资料"}
          </button>
          <button className="btn-ghost" onClick={() => setOpen(false)}>
            暂时跳过
          </button>
        </div>
      </div>
    </div>
  );
}
