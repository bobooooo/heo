import Link from "next/link";
import { notFound } from "next/navigation";
import { unwrapParams } from "@/lib/params";
import { requireUser } from "@/server/auth/require-user";
import { getProfile } from "@/server/profile";
import { getRequest } from "@/server/requests";
import RequestHelpForm from "@/components/request-help-form";

export default async function RequestDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const { id } = await unwrapParams(params);
  const request = await getRequest(id);
  if (!request) {
    notFound();
  }

  const user = await requireUser();
  const profile = user ? await getProfile(user.id) : null;
  const isOwner = user?.id === request.userId;
  const isOpen = request.status === "OPEN";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="paper-card p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
          求助详情
        </p>
        <h2 className="font-display mt-2 text-3xl text-[#2b2620]">
          {request.title}
        </h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#5b5146]">
          <span>{request.city.name}</span>
          <span>·</span>
          <span>{request.community.name}</span>
          <span>·</span>
          <span>{new Date(request.time).toLocaleString("zh-CN")}</span>
        </div>
        <p className="mt-4 text-sm text-[#5b5146]">分类：{request.category}</p>
        <p className="mt-6 text-base leading-relaxed text-[#4b453d]">
          {request.detail}
        </p>
        <div className="mt-6 rounded-2xl border border-white/70 bg-white/70 p-4 text-sm text-[#5b5146]">
          <p>联系电话：{request.contactPhone}</p>
          <p className="mt-2">联系微信：{request.contactWechat}</p>
        </div>
      </section>

      <aside id="help" className="paper-card p-8">
        <h3 className="font-display text-2xl text-[#2b2620]">我可以帮忙</h3>
        <p className="mt-2 text-sm text-[#5b5146]">
          提交联系方式后，发布者会看到你的信息并选择合适的帮助者。
        </p>
        <RequestHelpForm
          requestId={request.id}
          defaultName={profile?.name}
          defaultPhone={profile?.phone}
          defaultWechat={profile?.wechat}
          disabled={isOwner || !isOpen}
          disabledReason={
            isOwner
              ? "自己发布的求助无法申请帮助"
              : !isOpen
              ? "该求助已无法申请"
              : undefined
          }
        />
        <Link className="btn-ghost mt-4 w-full text-center" href="/">
          返回广场
        </Link>
      </aside>
    </div>
  );
}
