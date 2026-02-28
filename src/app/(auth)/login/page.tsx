import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
          登录
        </p>
        <h2 className="font-display text-3xl text-[#2b2620]">欢迎回来</h2>
        <p className="mt-2 text-sm text-[#5b5146]">
          继续查看邻里互助的最新动态。
        </p>
      </div>

      <form className="flex flex-1 flex-col gap-4">
        <label className="text-sm text-[#5b5146]">
          用户名
          <input className="input-field mt-2" placeholder="输入用户名" />
        </label>
        <label className="text-sm text-[#5b5146]">
          密码
          <input
            type="password"
            className="input-field mt-2"
            placeholder="输入密码"
          />
        </label>
        <button type="button" className="btn-primary mt-2">
          登录进入
        </button>
      </form>

      <div className="mt-6 text-sm text-[#7a6e60]">
        还没有账号？
        <Link href="/register" className="ml-2 font-semibold text-[#2f6f68]">
          去注册
        </Link>
      </div>
    </div>
  );
}
