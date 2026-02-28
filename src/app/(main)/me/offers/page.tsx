const myOffers = [
  {
    id: "1",
    title: "陪诊：下午去医院",
    status: "PENDING",
    time: "明日 14:00",
  },
  {
    id: "2",
    title: "喂猫：周末上门",
    status: "SELECTED",
    time: "周六 09:00",
  },
  {
    id: "3",
    title: "遛狗：晚间散步",
    status: "REJECTED",
    time: "昨天 19:00",
  },
];

const statusLabel: Record<string, string> = {
  PENDING: "申请中",
  SELECTED: "已被选中",
  REJECTED: "已拒绝",
  CANCELED: "已取消",
};

export default function MyOffersPage() {
  return (
    <div className="paper-card p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
          我的帮助
        </p>
        <h2 className="font-display text-3xl text-[#2b2620]">帮助记录</h2>
      </div>

      <div className="grid gap-4">
        {myOffers.map((item) => (
          <article
            key={item.id}
            className="rounded-3xl border border-white/70 bg-white/80 p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[#2b2620]">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-[#5b5146]">时间：{item.time}</p>
              </div>
              <span className="tag bg-[#d36c44] text-white">
                {statusLabel[item.status]}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="btn-primary">查看详情</button>
              <button className="btn-ghost">取消帮助</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
