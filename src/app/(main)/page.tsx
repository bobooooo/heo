import Link from "next/link";
import { listCities } from "@/server/cities";
import { listRequests } from "@/server/requests";
import { getGroupedCityOptions } from "@/lib/city-data";
import { getRequestDetailHref, getRequestHelpHref } from "@/lib/request-links";

const statusStyles: Record<string, string> = {
  OPEN: "bg-[#2f6f68] text-white",
  MATCHED: "bg-[#d36c44] text-white",
  COMPLETED: "bg-[#2b2620] text-white",
  CANCELED: "bg-[#7a6e60] text-white",
};

const statusLabel: Record<string, string> = {
  OPEN: "发布中",
  MATCHED: "待完成",
  COMPLETED: "已完成",
  CANCELED: "已取消",
};

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { cityId?: string; status?: string };
}) {
  const cities = await listCities();
  const cityMap = new Map(cities.map((city) => [city.name, city.id]));
  const groupedCities = getGroupedCityOptions()
    .map((group) => ({
      label: group.label,
      options: group.options
        .map((item) => ({
          id: cityMap.get(item.city),
          name: item.city,
        }))
        .filter(
          (item): item is { id: string; name: string } => Boolean(item.id)
        ),
    }))
    .filter((group) => group.options.length > 0);
  const selectedCityValue = searchParams?.cityId ?? "all";
  const selectedCityId =
    selectedCityValue === "all" ? undefined : selectedCityValue;
  const status = searchParams?.status ?? "OPEN";

  const selectedCityName =
    selectedCityValue === "all"
      ? "全部城市"
      : cities.find((city) => city.id === selectedCityValue)?.name ?? "未选择";

  const requests = await listRequests({
    cityId: selectedCityId,
    status: status as "OPEN" | "MATCHED" | "COMPLETED" | "CANCELED",
  });

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="paper-card p-8 fade-up">
          <h2 className="font-display text-4xl text-[#2b2620]">
            今日互助广场
          </h2>
          <p className="mt-3 text-sm text-[#5b5146]">
            选择你所在的城市，小区默认不限，即刻查看等待帮助的需求。
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            {["陪诊", "喂猫", "遛狗", "代买药", "陪同办事"].map((tag) => (
              <span
                key={tag}
                className="tag border border-[#e7d6c4] bg-white/70 text-[#7a6e60]"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
                当前发布
              </p>
              <p className="mt-2 text-3xl font-semibold text-[#2b2620]">
                {requests.length}
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
                筛选范围
              </p>
              <p className="mt-2 text-sm text-[#5b5146]">
                {selectedCityName}
              </p>
            </div>
          </div>
        </div>
        <div className="paper-card p-8 fade-up-delay">
          <h3 className="font-display text-2xl text-[#2b2620]">筛选范围</h3>
          <p className="mt-2 text-sm text-[#5b5146]">
            先选定城市，小区默认不限，再查看附近的求助信息。
          </p>
          <form className="mt-6 space-y-4" method="get">
            <label className="text-sm text-[#5b5146]">
              城市
              <select
                name="cityId"
                className="select-field mt-2"
                defaultValue={selectedCityValue}
              >
                <option value="all">全部城市</option>
                {groupedCities.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="text-sm text-[#5b5146]">
              状态
              <select
                name="status"
                className="select-field mt-2"
                defaultValue={status}
              >
                <option value="OPEN">发布中</option>
                <option value="MATCHED">待完成</option>
                <option value="COMPLETED">已完成</option>
                <option value="CANCELED">已取消</option>
              </select>
            </label>
            <button className="btn-primary w-full" type="submit">
              更新筛选
            </button>
          </form>
        </div>
      </section>

      <section className="paper-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
              最新求助
            </p>
            <h3 className="font-display text-2xl text-[#2b2620]">
              等待你的帮助
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              "全部",
              "陪诊",
              "喂猫",
              "遛狗",
              "今日",
              "可帮忙",
            ].map((filter) => (
              <span
                key={filter}
                className="tag border border-[#e7d6c4] bg-white/70 text-[#7a6e60]"
              >
                {filter}
              </span>
            ))}
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-[#e7d6c4] bg-white/70 p-10 text-center text-sm text-[#7a6e60]">
            当前筛选条件下暂无求助需求，试试换一个城市或查看全部。
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {requests.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-white/70 bg-white/80 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#7a6e60]">
                      {item.city.name} · {item.community.name}
                    </p>
                    <h4 className="mt-2 text-lg font-semibold text-[#2b2620]">
                      {item.title}
                    </h4>
                  </div>
                  <span className={`tag ${statusStyles[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[#5b5146]">{item.detail}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#5b5146]">
                  <span>时间：{new Date(item.time).toLocaleString("zh-CN")}</span>
                  <span>分类：{item.category}</span>
                  <span>已有 {item._count.offers} 人申请</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link className="btn-primary" href={getRequestHelpHref(item.id)}>
                    我可以帮忙
                  </Link>
                  <Link className="btn-ghost" href={getRequestDetailHref(item.id)}>
                    查看详情
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
