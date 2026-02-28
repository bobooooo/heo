import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
          注册
        </p>
        <h2 className="font-display text-3xl text-[#2b2620]">加入互助社区</h2>
        <p className="mt-2 text-sm text-[#5b5146]">
          只需一个账号，就能发布求助或成为帮助者。
        </p>
      </div>

      <form className="flex flex-1 flex-col gap-4">
        <label className="text-sm text-[#5b5146]">
          用户名
          <input className="input-field mt-2" placeholder="设置用户名" />
        </label>
        <label className="text-sm text-[#5b5146]">
          密码
          <input
            type="password"
            className="input-field mt-2"
            placeholder="设置密码"
          />
        </label>
        <label className="text-sm text-[#5b5146]">
          再次确认密码
          <input
            type="password"
            className="input-field mt-2"
            placeholder="再次输入密码"
          />
        </label>
        <button type="button" className="btn-primary mt-2">
          完成注册
        </button>
      </form>

      <div className="mt-6 text-sm text-[#7a6e60]">
        已有账号？
        <Link href="/login" className="ml-2 font-semibold text-[#2f6f68]">
          去登录
        </Link>
      </div>
    </div>
  );
}
