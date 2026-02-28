export default function NewRequestPage() {
  return (
    <div className="paper-card p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
          发布求助
        </p>
        <h2 className="font-display text-3xl text-[#2b2620]">说出你的需求</h2>
        <p className="mt-2 text-sm text-[#5b5146]">
          清晰的描述能帮助你更快匹配到合适的帮忙者。
        </p>
      </div>

      <form className="grid gap-6 lg:grid-cols-2">
        <label className="text-sm text-[#5b5146]">
          时间
          <input className="input-field mt-2" placeholder="例如：3 月 5 日 14:00" />
        </label>
        <label className="text-sm text-[#5b5146]">
          标题
          <input className="input-field mt-2" placeholder="简洁描述求助主题" />
        </label>
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
        <label className="text-sm text-[#5b5146]">
          分类
          <select className="select-field mt-2">
            <option>陪诊</option>
            <option>喂猫</option>
            <option>遛狗</option>
          </select>
        </label>
        <label className="text-sm text-[#5b5146]">
          联系电话
          <input className="input-field mt-2" placeholder="填写手机号" />
        </label>
        <label className="text-sm text-[#5b5146]">
          联系微信
          <input className="input-field mt-2" placeholder="填写微信号" />
        </label>
        <label className="text-sm text-[#5b5146] lg:col-span-2">
          详情描述
          <textarea
            className="input-field mt-2 min-h-[140px]"
            placeholder="描述你的具体需求、注意事项与预期时长"
          />
        </label>
        <div className="lg:col-span-2 flex flex-wrap gap-3">
          <button type="button" className="btn-primary">
            发布求助
          </button>
          <button type="button" className="btn-ghost">
            保存草稿
          </button>
        </div>
      </form>
    </div>
  );
}
