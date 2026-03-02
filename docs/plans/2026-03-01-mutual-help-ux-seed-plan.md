# 互相帮助 MVP 体验优化与演示数据 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 增加一键演示数据入口与关键页面体验优化（加载/空态/反馈），便于快速演示与验收。

**Architecture:** 在服务层新增演示数据生成与清理函数，API 路由仅开发环境开放；前端新增 `/demo` 页面与按钮调用 API。UI 体验通过 `loading.tsx` 与空状态 CTA 补齐。

**Tech Stack:** Next.js App Router、React、TypeScript、Prisma、PostgreSQL、Vitest、Tailwind CSS。

---

### Task 1: 演示数据服务（TDD）

**Files:**
- Create: `src/server/demo-seed.ts`
- Test: `src/server/__tests__/demo-seed.test.ts`

**Step 1: Write the failing test**

```ts
import { afterAll, expect, it } from "vitest";
import { prisma } from "../../lib/prisma";
import { clearDemoData, seedDemoData } from "../demo-seed";

const created = { userId: "" };

it("seeds demo data idempotently", async () => {
  const user = await prisma.user.create({
    data: { username: `seed_${Date.now()}`, password: "test" },
  });
  created.userId = user.id;

  const summary1 = await seedDemoData(user.id);
  const summary2 = await seedDemoData(user.id);

  const demoUsers = await prisma.user.findMany({
    where: { username: { startsWith: "demo_" } },
  });
  const demoRequests = await prisma.helpRequest.findMany({
    where: { title: { startsWith: "【演示】" } },
  });

  expect(demoUsers.length).toBe(3);
  expect(summary1.requests).toBe(summary2.requests);
  expect(demoRequests.length).toBe(summary1.requests);
});

afterAll(async () => {
  if (created.userId) {
    await clearDemoData(created.userId);
    await prisma.user.delete({ where: { id: created.userId } });
  }
  await prisma.$disconnect();
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- src/server/__tests__/demo-seed.test.ts`
Expected: FAIL with "seedDemoData is not defined"

**Step 3: Write minimal implementation**

```ts
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/server/auth/password";
import { completeRequest, createRequest } from "@/server/requests";
import { createOffer, selectOffer } from "@/server/offers";

const DEMO_PREFIX = "demo_";
const DEMO_TITLE_PREFIX = "【演示】";

export async function ensureDemoLocations() {
  const existing = await prisma.city.findFirst({
    include: { communities: true },
  });
  if (existing?.communities.length) return existing;

  const city = await prisma.city.create({ data: { name: "上海" } });
  await prisma.community.createMany({
    data: ["静安", "徐汇", "浦东"].map((name) => ({ name, cityId: city.id })),
  });
  return prisma.city.findFirst({ include: { communities: true } });
}

export async function clearDemoData(userId: string) {
  const demoUsers = await prisma.user.findMany({
    where: { username: { startsWith: DEMO_PREFIX } },
    select: { id: true },
  });
  const demoUserIds = demoUsers.map((u) => u.id);

  const demoRequests = await prisma.helpRequest.findMany({
    where: {
      OR: [
        { userId: { in: demoUserIds } },
        { userId, title: { startsWith: DEMO_TITLE_PREFIX } },
      ],
    },
    select: { id: true },
  });
  const demoRequestIds = demoRequests.map((r) => r.id);

  await prisma.helpOffer.deleteMany({
    where: {
      OR: [
        { helperId: { in: demoUserIds } },
        { requestId: { in: demoRequestIds } },
        {
          helperId: userId,
          request: { title: { startsWith: DEMO_TITLE_PREFIX } },
        },
      ],
    },
  });
  await prisma.helpRequest.deleteMany({
    where: {
      OR: [
        { userId: { in: demoUserIds } },
        { userId, title: { startsWith: DEMO_TITLE_PREFIX } },
      ],
    },
  });
  await prisma.notification.deleteMany({
    where: { userId: { in: demoUserIds } },
  });
  await prisma.session.deleteMany({ where: { userId: { in: demoUserIds } } });
  await prisma.profile.deleteMany({ where: { userId: { in: demoUserIds } } });
  await prisma.user.deleteMany({ where: { id: { in: demoUserIds } } });
}

export async function seedDemoData(userId: string) {
  await clearDemoData(userId);
  const city = await ensureDemoLocations();
  const community = city?.communities[0];
  if (!city || !community) throw new Error("缺少城市与小区数据");

  const password = await hashPassword("123456");
  const demoOwner = await prisma.user.upsert({
    where: { username: "demo_owner" },
    update: { password },
    create: { username: "demo_owner", password },
  });
  const demoHelper1 = await prisma.user.upsert({
    where: { username: "demo_helper1" },
    update: { password },
    create: { username: "demo_helper1", password },
  });
  const demoHelper2 = await prisma.user.upsert({
    where: { username: "demo_helper2" },
    update: { password },
    create: { username: "demo_helper2", password },
  });

  await prisma.profile.upsert({
    where: { userId: demoOwner.id },
    update: { name: "演示发布者", phone: "13800000001", wechat: "demo_owner" },
    create: {
      userId: demoOwner.id,
      name: "演示发布者",
      phone: "13800000001",
      wechat: "demo_owner",
    },
  });
  await prisma.profile.upsert({
    where: { userId: demoHelper1.id },
    update: { name: "演示帮手A", phone: "13800000002", wechat: "demo_helper1" },
    create: {
      userId: demoHelper1.id,
      name: "演示帮手A",
      phone: "13800000002",
      wechat: "demo_helper1",
    },
  });
  await prisma.profile.upsert({
    where: { userId: demoHelper2.id },
    update: { name: "演示帮手B", phone: "13800000003", wechat: "demo_helper2" },
    create: {
      userId: demoHelper2.id,
      name: "演示帮手B",
      phone: "13800000003",
      wechat: "demo_helper2",
    },
  });

  const openRequest = await createRequest(userId, {
    cityId: city.id,
    communityId: community.id,
    time: new Date().toISOString(),
    title: `${DEMO_TITLE_PREFIX}陪诊（发布中）`,
    category: "陪诊",
    detail: "需要有人陪同就诊，时间可协商。",
    contactPhone: "13800000000",
    contactWechat: "seed_user",
  });
  await createOffer(openRequest.id, demoHelper1.id, {
    name: "演示帮手A",
    phone: "13800000002",
    wechat: "demo_helper1",
  });
  await createOffer(openRequest.id, demoHelper2.id, {
    name: "演示帮手B",
    phone: "13800000003",
    wechat: "demo_helper2",
  });

  const completedRequest = await createRequest(userId, {
    cityId: city.id,
    communityId: community.id,
    time: new Date().toISOString(),
    title: `${DEMO_TITLE_PREFIX}喂猫（已完成）`,
    category: "喂猫",
    detail: "出差期间上门喂猫。",
    contactPhone: "13800000000",
    contactWechat: "seed_user",
  });
  const completedOffer = await createOffer(completedRequest.id, demoHelper1.id, {
    name: "演示帮手A",
    phone: "13800000002",
    wechat: "demo_helper1",
  });
  await selectOffer(completedRequest.id, completedOffer.id, userId);
  await completeRequest(completedRequest.id, userId);

  const squareRequest = await createRequest(demoOwner.id, {
    cityId: city.id,
    communityId: community.id,
    time: new Date().toISOString(),
    title: `${DEMO_TITLE_PREFIX}代买药（等待帮助）`,
    category: "代买药",
    detail: "附近药店购买常用药。",
    contactPhone: "13800000001",
    contactWechat: "demo_owner",
  });

  const matchedRequest = await createRequest(demoOwner.id, {
    cityId: city.id,
    communityId: community.id,
    time: new Date().toISOString(),
    title: `${DEMO_TITLE_PREFIX}遛狗（已选中帮助者）`,
    category: "遛狗",
    detail: "晚上 7 点左右遛狗。",
    contactPhone: "13800000001",
    contactWechat: "demo_owner",
  });
  const matchedOffer = await createOffer(matchedRequest.id, userId, {
    name: "当前用户",
    phone: "13800000000",
    wechat: "seed_user",
  });
  await selectOffer(matchedRequest.id, matchedOffer.id, demoOwner.id);

  const requests = await prisma.helpRequest.count({
    where: { title: { startsWith: DEMO_TITLE_PREFIX } },
  });
  const offers = await prisma.helpOffer.count({
    where: { request: { title: { startsWith: DEMO_TITLE_PREFIX } } },
  });

  return {
    users: 3,
    requests,
    offers,
    accounts: [
      { username: "demo_owner", password: "123456" },
      { username: "demo_helper1", password: "123456" },
      { username: "demo_helper2", password: "123456" },
    ],
  };
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- src/server/__tests__/demo-seed.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/server/demo-seed.ts src/server/__tests__/demo-seed.test.ts
git commit -m "feat: add demo seed service"
```

---

### Task 2: 演示数据 API 路由

**Files:**
- Create: `src/app/api/demo/seed/route.ts`

**Step 1: Implement API handler**

```ts
import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/require-user";
import { seedDemoData } from "@/server/demo-seed";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "线上环境禁止生成演示数据" }, { status: 403 });
  }
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }
  const summary = await seedDemoData(user.id);
  return NextResponse.json(summary);
}
```

**Step 2: Manual smoke**

Run: `npm run dev`
Expected: `POST /api/demo/seed` 返回演示数据统计

**Step 3: Commit**

```bash
git add src/app/api/demo/seed/route.ts
git commit -m "feat: add demo seed api"
```

---

### Task 3: 演示数据页面与按钮

**Files:**
- Create: `src/app/(main)/demo/page.tsx`
- Create: `src/components/demo-seed-panel.tsx`
- Modify: `src/app/(main)/layout.tsx`

**Step 1: Add client panel component**

```tsx
"use client";

import { useState } from "react";

type SeedSummary = {
  users: number;
  requests: number;
  offers: number;
  accounts: { username: string; password: string }[];
};

export default function DemoSeedPanel() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SeedSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/demo/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "生成失败");
        return;
      }
      setSummary(data);
    } catch (err) {
      setError("网络错误，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button className="btn-primary w-full" onClick={handleSeed} disabled={loading}>
        {loading ? "正在生成..." : "生成/重置演示数据"}
      </button>
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {summary && (
        <div className="rounded-2xl border border-white/70 bg-white/80 p-4 text-sm text-[#5b5146]">
          <p>已生成 {summary.requests} 条求助、{summary.offers} 条帮助申请。</p>
          <p className="mt-2 font-semibold text-[#2b2620]">演示账号</p>
          <ul className="mt-2 space-y-1">
            {summary.accounts.map((account) => (
              <li key={account.username}>
                {account.username} / {account.password}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Create demo page**

```tsx
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
```

**Step 3: Update navigation (dev-only)**

```ts
const navItems = [
  ...
  ...(process.env.NODE_ENV !== "production"
    ? [{ href: "/demo", label: "演示数据" }]
    : []),
];
```

**Step 4: Manual smoke**

Run: `npm run dev`
Expected: 导航可进入 `/demo`，按钮可成功生成数据

**Step 5: Commit**

```bash
git add src/app/(main)/demo/page.tsx src/components/demo-seed-panel.tsx src/app/(main)/layout.tsx
git commit -m "feat: add demo data page"
```

---

### Task 4: 加载态与空状态优化

**Files:**
- Create: `src/app/(main)/loading.tsx`
- Modify: `src/components/my-requests-client.tsx`
- Modify: `src/components/my-offers-client.tsx`
- Modify: `src/components/notifications-client.tsx`

**Step 1: Add loading UI**

```tsx
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
```

**Step 2: Add CTA buttons to empty states**

```tsx
<div className="...">
  还没有发布过求助。
  <div className="mt-4">
    <Link href="/requests/new" className="btn-primary">去发布求助</Link>
  </div>
</div>
```

**Step 3: Manual smoke**

Run: `npm run dev`
Expected: 页面切换出现骨架屏，空状态有 CTA 按钮

**Step 4: Commit**

```bash
git add src/app/(main)/loading.tsx src/components/my-requests-client.tsx src/components/my-offers-client.tsx src/components/notifications-client.tsx
git commit -m "feat: polish loading and empty states"
```

---

Plan complete and saved to `docs/plans/2026-03-01-mutual-help-ux-seed-plan.md`. Two execution options:

1. Subagent-Driven (this session) - I dispatch fresh subagent per task, review between tasks, fast iteration  
2. Parallel Session (separate) - Open new session with executing-plans, batch execution with checkpoints

Which approach?
