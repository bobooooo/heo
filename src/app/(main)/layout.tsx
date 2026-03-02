import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/logout-button";
import ProfilePrompt from "@/components/profile-prompt";
import { requireUser } from "@/server/auth/require-user";

const baseNavItems = [
  { href: "/", label: "帮助广场" },
  { href: "/requests/new", label: "发布求助" },
  { href: "/me/requests", label: "我的求助" },
  { href: "/me/offers", label: "我的帮助" },
  { href: "/me/profile", label: "我的资料" },
  { href: "/notifications", label: "通知" },
];

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  if (!user) {
    redirect("/login");
  }

  const navItems =
    process.env.NODE_ENV !== "production"
      ? [...baseNavItems, { href: "/demo", label: "演示数据" }]
      : baseNavItems;

  return (
    <div className="min-h-screen">
      <header className="px-6 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#b45632]">
              Neighborhood Help
            </p>
            <h1 className="font-display text-3xl text-[#2b2620]">
              互相帮助广场
            </h1>
            <p className="mt-2 text-sm text-[#5b5146]">
              欢迎回来，{user.username}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/70 bg-white/70 px-4 py-1 text-xs text-[#5b5146]">
              今日活跃 24
            </span>
            <Link href="/requests/new" className="btn-primary">
              发布新求助
            </Link>
            <LogoutButton />
          </div>
        </div>
        <nav className="mx-auto mt-6 flex w-full max-w-6xl flex-wrap gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="btn-ghost">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <ProfilePrompt />

      <main className="px-6 pb-16">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
