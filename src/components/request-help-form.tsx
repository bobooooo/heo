"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  requestId: string;
  defaultName?: string | null;
  defaultPhone?: string | null;
  defaultWechat?: string | null;
  disabled?: boolean;
  disabledReason?: string;
};

export default function RequestHelpForm({
  requestId,
  defaultName,
  defaultPhone,
  defaultWechat,
  disabled,
  disabledReason,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState(defaultName ?? "");
  const [phone, setPhone] = useState(defaultPhone ?? "");
  const [wechat, setWechat] = useState(defaultWechat ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isDisabled = useMemo(() => {
    if (disabled) return true;
    return !name || !phone || !wechat;
  }, [disabled, name, phone, wechat]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (disabled) return;
    setError(null);
    setSuccess(null);

    if (!name || !phone || !wechat) {
      setError("请填写姓名、电话与微信");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/requests/${requestId}/offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, wechat }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "提交失败");
        return;
      }
      setSuccess("已提交帮助信息，请等待发布者选择。");
      router.refresh();
    } catch (err) {
      setError("网络错误，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      {disabled && (
        <p className="rounded-2xl border border-[#e7d6c4] bg-white/70 px-4 py-3 text-sm text-[#7a6e60]">
          {disabledReason ?? "当前无法申请帮助"}
        </p>
      )}
      <label className="text-sm text-[#5b5146]">
        姓名
        <input
          className="input-field mt-2"
          placeholder="填写姓名"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={disabled}
        />
      </label>
      <label className="text-sm text-[#5b5146]">
        电话
        <input
          className="input-field mt-2"
          placeholder="填写手机号"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          disabled={disabled}
        />
      </label>
      <label className="text-sm text-[#5b5146]">
        微信
        <input
          className="input-field mt-2"
          placeholder="填写微信号"
          value={wechat}
          onChange={(event) => setWechat(event.target.value)}
          disabled={disabled}
        />
      </label>
      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </p>
      )}
      <button type="submit" className="btn-primary w-full" disabled={loading || isDisabled}>
        {loading ? "正在提交..." : "提交帮助"}
      </button>
    </form>
  );
}
