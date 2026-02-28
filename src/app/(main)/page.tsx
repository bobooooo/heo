const requests = [
  {
    id: "1",
    title: "陪诊：明日下午去医院",
    category: "陪诊",
    city: "上海",
    community: "静安",
    time: "明日 14:00",
    status: "OPEN",
    detail: "需要有人陪同挂号、取药，预计 2 小时。",
  },
  {
    id: "2",
    title: "喂猫：本周末短期托管",
    category: "喂猫",
    city: "北京",
    community: "朝阳",
    time: "周六 09:00",
    status: "MATCHED",
    detail: "需要上门喂猫并更换水，已经准备好猫粮。",
  },
  {
    id: "3",
    title: "遛狗：晚间散步",
    category: "遛狗",
    city: "深圳",
    community: "南山",
    time: "今晚 19:00",
    status: "OPEN",
    detail: "需要在小区内遛狗 40 分钟，金毛。",
  },
];

const statusStyles: Record<string, string> = {
  OPEN: "bg-[#2f6f68] text-white",
  MATCHED: "bg-[#d36c44] text-white",
  COMPLETED: "bg-[#2b2620] text-white",
};

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="paper-card p-8 fade-up">
          <h2 className="font-display text-4xl text-[#2b2620]">
            今日互助广场
          </h2>
          <p className="mt-3 text-sm text-[#5b5146]">
            选择你所在的城市与小区，看看附近有哪些正在等待帮助的需求。
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
                今日新增
              </p>
              <p className="mt-2 text-3xl font-semibold text-[#2b2620]">18</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
                正在匹配
              </p>
              <p className="mt-2 text-3xl font-semibold text-[#2b2620]">6</p>
            </div>
          </div>
        </div>
        <div className="paper-card p-8 fade-up-delay">
          <h3 className="font-display text-2xl text-[#2b2620]">筛选范围</h3>
          <p className="mt-2 text-sm text-[#5b5146]">
            先选定城市和小区，系统将展示附近的求助信息。
          </p>
          <div className="mt-6 space-y-4">
            <label className="text-sm text-[#5b5146]">
              城市
              <select className="select-field mt-2">
                <option>上海</option>
                <option>北京</option>
                <option>深圳</option>
              </select>
            </label>
            <label className="text-sm text-[#5b5146]">
              小区
              <select className="select-field mt-2">
                <option>静安</option>
                <option>徐汇</option>
                <option>浦东</option>
              </select>
            </label>
            <button className="btn-primary w-full">更新筛选</button>
          </div>
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
              <button
                key={filter}
                className="tag border border-[#e7d6c4] bg-white/70 text-[#7a6e60]"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {requests.map((item) => (
            <article key={item.id} className="rounded-3xl border border-white/70 bg-white/80 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-[#7a6e60]">{item.city} · {item.community}</p>
                  <h4 className="mt-2 text-lg font-semibold text-[#2b2620]">
                    {item.title}
                  </h4>
                </div>
                <span className={`tag ${statusStyles[item.status]}`}>
                  {item.status === "OPEN" && "发布中"}
                  {item.status === "MATCHED" && "待完成"}
                  {item.status === "COMPLETED" && "已完成"}
                </span>
              </div>
              <p className="mt-3 text-sm text-[#5b5146]">{item.detail}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#5b5146]">
                <span>时间：{item.time}</span>
                <span>分类：{item.category}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="btn-primary">我可以帮忙</button>
                <button className="btn-ghost">查看详情</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
