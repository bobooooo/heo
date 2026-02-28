export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto grid w-full max-w-6xl items-stretch gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="paper-card relative overflow-hidden p-10 fade-up">
          <div className="absolute right-6 top-6 rounded-full border border-white/70 bg-white/70 px-4 py-1 text-xs font-semibold text-[#b45632]">
            互相帮助 MVP
          </div>
          <h1 className="font-display text-4xl text-[#2b2620] md:text-5xl">
            邻里互助，从一次善意开始
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#4b453d]">
            发布求助、找到愿意帮忙的人，让社区的温度被看见。现在只需几步就可以加入互助广场。
          </p>
          <div className="mt-10 grid gap-4 text-sm text-[#4b453d] md:grid-cols-2">
            {[
              "帮助需求按城市与小区筛选",
              "多人响应，发布者自行选择",
              "联系方式可先补全，后续再完善",
              "系统通知提醒匹配进展",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3"
              >
                <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-[#2f6f68]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-3xl border border-dashed border-[#d9c5b0] bg-white/70 px-6 py-5 text-sm text-[#7a6e60]">
            “每一次主动伸手，都能让生活多一点确定。”
          </div>
        </section>
        <section className="paper-card p-8 fade-up-delay">
          {children}
        </section>
      </div>
    </div>
  );
}
