export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="paper-card p-8">
        <div className="h-6 w-40 rounded-full bg-[#efe6da]" />
        <div className="mt-4 h-4 w-64 rounded-full bg-[#f3ede6]" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="h-24 rounded-2xl bg-white/80" />
          <div className="h-24 rounded-2xl bg-white/80" />
        </div>
      </div>
      <div className="paper-card p-8">
        <div className="h-5 w-32 rounded-full bg-[#efe6da]" />
        <div className="mt-4 h-32 rounded-2xl bg-white/80" />
      </div>
    </div>
  );
}
