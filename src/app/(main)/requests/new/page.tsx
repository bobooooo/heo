"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getGroupedCityOptions } from "@/lib/city-data";

type City = { id: string; name: string };
type CityGroupOption = { label: string; options: City[] };

const categories = ["陪诊", "喂猫", "遛狗"];

export default function NewRequestPage() {
  const router = useRouter();
  const [cityGroups, setCityGroups] = useState<CityGroupOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    time: "",
    title: "",
    cityId: "",
    category: categories[0],
    detail: "",
    contactPhone: "",
    contactWechat: "",
  });

  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await fetch("/api/cities");
        const data: City[] = await res.json();
        const cityMap = new Map(data.map((city) => [city.name, city.id]));
        const grouped = getGroupedCityOptions()
          .map((group) => ({
            label: group.label,
            options: group.options
              .map((item) => ({
                id: cityMap.get(item.city),
                name: item.city,
              }))
              .filter((item): item is City => Boolean(item.id)),
          }))
          .filter((group) => group.options.length > 0);

        setCityGroups(grouped);

        if (grouped.length) {
          setForm((prev) => ({
            ...prev,
            cityId: grouped[0].options[0].id,
          }));
        } else {
          setError("暂无可用城市，请先初始化城市数据");
        }
      } catch (err) {
        setError("城市数据加载失败");
      }
    };

    loadCities();
  }, []);

  const isDisabled = useMemo(() => {
    return (
      !form.time ||
      !form.title ||
      !form.cityId ||
      !form.detail ||
      !form.contactPhone ||
      !form.contactWechat
    );
  }, [form]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (isDisabled) {
      setError("请先填写完整信息");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          time: form.time,
          title: form.title,
          cityId: form.cityId,
          category: form.category,
          detail: form.detail,
          contactPhone: form.contactPhone,
          contactWechat: form.contactWechat,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "发布失败");
        return;
      }

      router.push(`/requests/${data.id}`);
    } catch (err) {
      setError("网络错误，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paper-card p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
          发布求助
        </p>
        <h2 className="font-display text-3xl text-[#2b2620]">说出你的需求</h2>
        <p className="mt-2 text-sm text-[#5b5146]">
          清晰的描述能帮助你更快匹配到合适的帮忙者，小区默认不限。
        </p>
      </div>

      <form className="grid gap-6 lg:grid-cols-2" onSubmit={handleSubmit}>
        <label className="text-sm text-[#5b5146]">
          时间
          <input
            type="datetime-local"
            className="input-field mt-2"
            value={form.time}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, time: event.target.value }))
            }
          />
        </label>
        <label className="text-sm text-[#5b5146]">
          标题
          <input
            className="input-field mt-2"
            placeholder="简洁描述求助主题"
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
          />
        </label>
        <label className="text-sm text-[#5b5146]">
          城市
          <select
            className="select-field mt-2"
            value={form.cityId}
            disabled={cityGroups.length === 0}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                cityId: event.target.value,
              }))
            }
          >
            {cityGroups.length === 0 ? (
              <option value="">正在加载城市...</option>
            ) : (
              cityGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </optgroup>
              ))
            )}
          </select>
        </label>
        <label className="text-sm text-[#5b5146]">
          小区
          <input
            className="input-field mt-2"
            value="不限（系统默认）"
            readOnly
          />
        </label>
        <label className="text-sm text-[#5b5146]">
          分类
          <select
            className="select-field mt-2"
            value={form.category}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                category: event.target.value,
              }))
            }
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="text-sm text-[#5b5146]">
          联系电话
          <input
            className="input-field mt-2"
            placeholder="填写手机号"
            value={form.contactPhone}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                contactPhone: event.target.value,
              }))
            }
          />
        </label>
        <label className="text-sm text-[#5b5146]">
          联系微信
          <input
            className="input-field mt-2"
            placeholder="填写微信号"
            value={form.contactWechat}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                contactWechat: event.target.value,
              }))
            }
          />
        </label>
        <label className="text-sm text-[#5b5146] lg:col-span-2">
          详情描述
          <textarea
            className="input-field mt-2 min-h-[140px]"
            placeholder="描述你的具体需求、注意事项与预期时长"
            value={form.detail}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, detail: event.target.value }))
            }
          />
        </label>
        {error && (
          <div className="lg:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="lg:col-span-2 flex flex-wrap gap-3">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || isDisabled}
          >
            {loading ? "正在发布..." : "发布求助"}
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => router.push("/")}
          >
            返回广场
          </button>
        </div>
      </form>
    </div>
  );
}
