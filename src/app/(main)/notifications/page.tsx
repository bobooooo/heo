import NotificationsClient from "@/components/notifications-client";

export default function NotificationsPage() {
  return (
    <div className="paper-card p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
          系统通知
        </p>
        <h2 className="font-display text-3xl text-[#2b2620]">最新动态</h2>
      </div>

      <NotificationsClient />
    </div>
  );
}
