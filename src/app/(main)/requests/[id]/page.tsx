import Link from "next/link";

const detail = {
  title: "陪诊：明日下午去医院",
  city: "上海",
  community: "静安",
  time: "明日 14:00",
  category: "陪诊",
  detail: "需要有人陪同挂号、取药，预计 2 小时。希望熟悉医院流程的朋友帮助。",
  contactPhone: "联系后可见",
  contactWechat: "联系后可见",
};

export default function RequestDetailPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="paper-card p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
          求助详情
        </p>
        <h2 className="font-display mt-2 text-3xl text-[#2b2620]">
          {detail.title}
        </h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#5b5146]">
          <span>{detail.city}</span>
          <span>·</span>
          <span>{detail.community}</span>
          <span>·</span>
          <span>{detail.time}</span>
        </div>
        <p className="mt-4 text-sm text-[#5b5146]">分类：{detail.category}</p>
        <p className="mt-6 text-base leading-relaxed text-[#4b453d]">
          {detail.detail}
        </p>
      </section>

      <aside id="help" className="paper-card p-8">
        <h3 className="font-display text-2xl text-[#2b2620]">
          我可以帮忙
        </h3>
        <p className="mt-2 text-sm text-[#5b5146]">
          提交联系方式后，发布者会看到你的信息并选择合适的帮助者。
        </p>
        <div className="mt-6 space-y-4">
          <label className="text-sm text-[#5b5146]">
            姓名
            <input className="input-field mt-2" placeholder="填写姓名" />
          </label>
          <label className="text-sm text-[#5b5146]">
            电话
            <input className="input-field mt-2" placeholder="填写手机号" />
          </label>
          <label className="text-sm text-[#5b5146]">
            微信
            <input className="input-field mt-2" placeholder="填写微信号" />
          </label>
          <button className="btn-primary w-full">提交帮助</button>
          <Link className="btn-ghost w-full text-center" href="/">
            返回广场
          </Link>
        </div>
      </aside>
    </div>
  );
}
