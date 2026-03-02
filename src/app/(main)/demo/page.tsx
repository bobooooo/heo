import DemoSeedPanel from "@/components/demo-seed-panel";

export default function DemoPage() {
  return (
    <div className="space-y-6">
      <section className="paper-card p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b45632]">
          演示数据
        </p>
        <h2 className="font-display mt-2 text-3xl text-[#2b2620]">
          一键生成演示场景
        </h2>
        <p className="mt-3 text-sm text-[#5b5146]">
          生成后将自动覆盖旧的演示数据，不影响真实用户数据。
        </p>
      </section>
      <section className="paper-card p-8">
        <DemoSeedPanel />
      </section>
    </div>
  );
}
