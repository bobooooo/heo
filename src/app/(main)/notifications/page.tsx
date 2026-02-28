const notifications = [
  {
    id: "1",
    title: "你的求助已匹配帮助者",
    detail: "你选择了“王女士”，请尽快线下联系。",
    time: "5 分钟前",
  },
  {
    id: "2",
    title: "求助已找到帮助",
    detail: "你申请的帮助已被对方确认，感谢你的支持。",
    time: "1 小时前",
  },
  {
    id: "3",
    title: "求助已完成",
    detail: "发布者已标记完成，感谢你的参与。",
    time: "昨天",
  },
];

export default function NotificationsPage() {
  return (
    <div className="paper-card p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
          系统通知
        </p>
        <h2 className="font-display text-3xl text-[#2b2620]">最新动态</h2>
      </div>

      <div className="grid gap-4">
        {notifications.map((note) => (
          <article
            key={note.id}
            className="rounded-3xl border border-white/70 bg-white/80 p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-[#2b2620]">
                {note.title}
              </h3>
              <span className="text-xs text-[#7a6e60]">{note.time}</span>
            </div>
            <p className="mt-2 text-sm text-[#5b5146]">{note.detail}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="btn-ghost">标记已读</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
