# 互相帮助 Web MVP 实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> （系统约束：此行必须保留英文，供工具识别）

**目标：** 交付一个包含认证、资料、求助、帮助与系统通知的 Next.js 全栈 MVP。

**架构：** Next.js App Router + `src/app/api` 路由处理器；业务逻辑在 `src/server/*`；Prisma 作为数据层；Session token 存于 HTTP-only Cookie。

**技术栈：** Next.js（App Router）+ React + TypeScript + Prisma + PostgreSQL + Tailwind CSS + bcryptjs + zod + vitest。

---

### 任务 1：初始化仓库与 Next.js 应用

**文件：**
- Create: （由 Next.js 脚手架生成）
- Modify: `package.json`

**步骤 1：初始化 git（如需要）**

Run: `git init`
Expected: repository initialized

**步骤 2：创建 Next.js 项目**

Run: `npm create next-app@latest . -- --ts --tailwind --eslint --app --src-dir --import-alias "@/*"`
Expected: Next.js project scaffolded

**步骤 3：安装依赖**

Run: `npm install`
Expected: dependencies installed

**步骤 4：提交**

Run:
```bash
git add .
git commit -m "chore: scaffold next app"
```

### 任务 2：添加 Prisma + Vitest 工具

**文件：**
- Create: `prisma/schema.prisma`, `src/lib/prisma.ts`, `vitest.config.ts`
- Modify: `package.json`, `.env`

**步骤 1：安装依赖**

Run: `npm install prisma @prisma/client bcryptjs zod`
Run: `npm install -D vitest @types/bcryptjs`

**步骤 2：创建 Prisma schema（骨架）**

Create `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**步骤 3：添加 Prisma Client helper**

Create `src/lib/prisma.ts`:
```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**步骤 4：配置 Vitest**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
});
```

**步骤 5：补充脚本**

Modify `package.json`:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

**步骤 6：提交**

Run:
```bash
git add prisma/schema.prisma src/lib/prisma.ts vitest.config.ts package.json package-lock.json
git commit -m "chore: add prisma and vitest"
```

### 任务 3：定义数据库模型

**文件：**
- Modify: `prisma/schema.prisma`

**步骤 1：编写失败测试（状态流转）**

Create `src/server/__tests__/status.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { applySelection } from "../status";

it("selecting a helper marks others rejected", () => {
  const result = applySelection({
    offers: ["a", "b", "c"],
    selectedId: "b",
  });
  expect(result.selected).toBe("b");
  expect(result.rejected).toEqual(["a", "c"]);
});
```

**步骤 2：运行测试确认失败**

Run: `npm run test -- src/server/__tests__/status.test.ts`
Expected: FAIL with "applySelection is not defined"

**步骤 3：补全 schema 模型**

Modify `prisma/schema.prisma`:
```prisma
model User {
  id        String    @id @default(cuid())
  username  String    @unique
  password  String
  createdAt DateTime  @default(now())
  profile   Profile?
  sessions  Session[]
  requests  HelpRequest[]
  offers    HelpOffer[]
}

model Profile {
  id      String @id @default(cuid())
  userId  String @unique
  name    String?
  phone   String?
  wechat  String?
  user    User   @relation(fields: [userId], references: [id])
}

model Session {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id])
}

model City {
  id          String      @id @default(cuid())
  name        String
  communities Community[]
  requests    HelpRequest[]
}

model Community {
  id      String @id @default(cuid())
  name    String
  cityId  String
  city    City   @relation(fields: [cityId], references: [id])
  requests HelpRequest[]
}

enum RequestStatus {
  OPEN
  MATCHED
  COMPLETED
  CANCELED
}

enum OfferStatus {
  PENDING
  SELECTED
  REJECTED
  CANCELED
}

model HelpRequest {
  id            String        @id @default(cuid())
  userId        String
  cityId        String
  communityId   String
  time          DateTime
  title         String
  category      String
  detail        String
  contactPhone  String
  contactWechat String
  status        RequestStatus @default(OPEN)
  createdAt     DateTime      @default(now())
  user          User          @relation(fields: [userId], references: [id])
  city          City          @relation(fields: [cityId], references: [id])
  community     Community     @relation(fields: [communityId], references: [id])
  offers        HelpOffer[]
}

model HelpOffer {
  id         String      @id @default(cuid())
  requestId  String
  helperId   String
  name       String
  phone      String
  wechat     String
  status     OfferStatus @default(PENDING)
  createdAt  DateTime    @default(now())
  request    HelpRequest @relation(fields: [requestId], references: [id])
  helper     User        @relation(fields: [helperId], references: [id])
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String
  payload   Json
  readAt    DateTime?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

**步骤 4：实现状态辅助函数**

Create `src/server/status.ts`:
```ts
export function applySelection(input: { offers: string[]; selectedId: string }) {
  const rejected = input.offers.filter((id) => id !== input.selectedId);
  return { selected: input.selectedId, rejected };
}
```

**步骤 5：运行测试**

Run: `npm run test -- src/server/__tests__/status.test.ts`
Expected: PASS

**步骤 6：提交**

Run:
```bash
git add prisma/schema.prisma src/server/status.ts src/server/__tests__/status.test.ts
git commit -m "feat: add prisma models and status helper"
```

### 任务 4：迁移与种子数据

**文件：**
- Create: `prisma/seed.ts`
- Modify: `package.json`, `.env`

**步骤 1：添加 seed 脚本**

Create `prisma/seed.ts`:
```ts
import { prisma } from "../src/lib/prisma";

const cities = [
  { name: "上海", communities: ["静安", "徐汇", "浦东"] },
  { name: "北京", communities: ["朝阳", "海淀", "东城"] },
  { name: "深圳", communities: ["南山", "福田", "罗湖"] },
];

async function main() {
  for (const city of cities) {
    const created = await prisma.city.create({ data: { name: city.name } });
    await prisma.community.createMany({
      data: city.communities.map((name) => ({ name, cityId: created.id })),
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**步骤 2：补充 Prisma 脚本**

Modify `package.json`:
```json
{
  "scripts": {
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "prisma db seed"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\\"module\\":\\"CommonJS\\"} prisma/seed.ts"
  }
}
```

**步骤 3：执行迁移与 seed**

Run:
```bash
npx prisma migrate dev --name init
npm run prisma:seed
```
Expected: migrations applied and cities/communities inserted

**步骤 4：提交**

Run:
```bash
git add prisma/seed.ts package.json package-lock.json
git commit -m "feat: add seed data"
```

### 任务 5：认证工具（密码 + session）

**文件：**
- Create: `src/server/auth/password.ts`, `src/server/auth/session.ts`, `src/server/auth/__tests__/password.test.ts`

**步骤 1：编写失败测试（密码哈希）**

Create `src/server/auth/__tests__/password.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../password";

it("hashes and verifies", async () => {
  const hash = await hashPassword("secret");
  const ok = await verifyPassword("secret", hash);
  expect(ok).toBe(true);
});
```

**步骤 2：运行测试确认失败**

Run: `npm run test -- src/server/auth/__tests__/password.test.ts`
Expected: FAIL with "hashPassword is not defined"

**步骤 3：实现密码辅助函数**

Create `src/server/auth/password.ts`:
```ts
import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
```

**步骤 4：运行测试**

Run: `npm run test -- src/server/auth/__tests__/password.test.ts`
Expected: PASS

**步骤 5：实现 session token helper**

Create `src/server/auth/session.ts`:
```ts
import { randomBytes } from "crypto";

export function newSessionToken() {
  return randomBytes(32).toString("hex");
}
```

**步骤 6：提交**

Run:
```bash
git add src/server/auth
git commit -m "feat: add password and session helpers"
```

### 任务 6：认证路由（注册/登录/退出）

**文件：**
- Create: `src/app/api/auth/register/route.ts`, `src/app/api/auth/login/route.ts`, `src/app/api/auth/logout/route.ts`
- Create: `src/server/auth/user.ts`, `src/server/auth/require-user.ts`

**步骤 1：编写失败测试（创建用户）**

Create `src/server/auth/__tests__/user.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { createUser } from "../user";

it("creates a user", async () => {
  const user = await createUser("demo", "secret");
  expect(user.username).toBe("demo");
});
```

**步骤 2：运行测试确认失败**

Run: `npm run test -- src/server/auth/__tests__/user.test.ts`
Expected: FAIL with "createUser is not defined"

**步骤 3：实现用户认证服务**

Create `src/server/auth/user.ts`:
```ts
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "./password";

export async function createUser(username: string, password: string) {
  const hashed = await hashPassword(password);
  return prisma.user.create({ data: { username, password: hashed } });
}

export async function validateUser(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return null;
  const ok = await verifyPassword(password, user.password);
  return ok ? user : null;
}
```

**步骤 4：实现路由处理器**

Create `src/app/api/auth/register/route.ts`:
```ts
import { NextResponse } from "next/server";
import { createUser } from "@/server/auth/user";
import { newSessionToken } from "@/server/auth/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const user = await createUser(username, password);
  const token = newSessionToken();
  await prisma.session.create({
    data: { token, userId: user.id, expiresAt: new Date(Date.now() + 7 * 864e5) },
  });
  const res = NextResponse.json({ id: user.id, username: user.username });
  res.cookies.set("session", token, { httpOnly: true, path: "/" });
  return res;
}
```

Create `src/app/api/auth/login/route.ts` and `logout/route.ts` similarly.

**步骤 5：运行测试**

Run: `npm run test -- src/server/auth/__tests__/user.test.ts`
Expected: PASS

**步骤 6：提交**

Run:
```bash
git add src/server/auth src/app/api/auth
git commit -m "feat: add auth routes"
```

### 任务 7：资料与基础数据 API

**文件：**
- Create: `src/app/api/profile/route.ts`, `src/app/api/cities/route.ts`, `src/app/api/cities/[id]/communities/route.ts`
- Create: `src/server/profile.ts`, `src/server/cities.ts`

**步骤 1：编写失败测试（资料更新）**

Create `src/server/__tests__/profile.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { updateProfile } from "../profile";

it("updates profile", async () => {
  const profile = await updateProfile("user-id", { name: "张三" });
  expect(profile.name).toBe("张三");
});
```

**步骤 2：运行测试确认失败**

Run: `npm run test -- src/server/__tests__/profile.test.ts`
Expected: FAIL with "updateProfile is not defined"

**步骤 3：实现服务与路由**

Create `src/server/profile.ts` and `src/app/api/profile/route.ts` to get/update profile.
Create `src/server/cities.ts` and routes to list cities/communities.

**步骤 4：运行测试**

Run: `npm run test -- src/server/__tests__/profile.test.ts`
Expected: PASS

**步骤 5：提交**

Run:
```bash
git add src/server/profile.ts src/server/cities.ts src/app/api/profile src/app/api/cities
git commit -m "feat: add profile and city APIs"
```

### 任务 8：求助服务与路由

**文件：**
- Create: `src/server/requests.ts`, `src/app/api/requests/route.ts`, `src/app/api/requests/[id]/route.ts`, `src/app/api/requests/[id]/cancel/route.ts`, `src/app/api/requests/[id]/complete/route.ts`

**步骤 1：编写失败测试（创建求助）**

Create `src/server/__tests__/requests.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { createRequest } from "../requests";

it("creates help request", async () => {
  const req = await createRequest("user-id", {
    cityId: "c1",
    communityId: "m1",
    time: new Date().toISOString(),
    title: "陪诊",
    category: "陪诊",
    detail: "需要帮助",
    contactPhone: "123",
    contactWechat: "wx123",
  });
  expect(req.title).toBe("陪诊");
});
```

**步骤 2：运行测试确认失败**

Run: `npm run test -- src/server/__tests__/requests.test.ts`
Expected: FAIL with "createRequest is not defined"

**步骤 3：实现求助服务与路由**

Create `src/server/requests.ts` with list/create/cancel/complete.
Add route handlers for list/create/detail/cancel/complete.

**步骤 4：运行测试**

Run: `npm run test -- src/server/__tests__/requests.test.ts`
Expected: PASS

**步骤 5：提交**

Run:
```bash
git add src/server/requests.ts src/app/api/requests src/server/__tests__/requests.test.ts
git commit -m "feat: add help requests"
```

### 任务 9：帮助申请与选择流程

**文件：**
- Create: `src/server/offers.ts`, `src/app/api/requests/[id]/offers/route.ts`, `src/app/api/offers/[id]/select/route.ts`, `src/app/api/offers/[id]/cancel/route.ts`, `src/app/api/offers/[id]/cancel-by-owner/route.ts`

**步骤 1：编写失败测试（选择帮助者）**

Create `src/server/__tests__/offers.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { selectOffer } from "../offers";

it("selects offer and rejects others", async () => {
  const result = await selectOffer("request-id", "offer-id");
  expect(result.selectedId).toBe("offer-id");
});
```

**步骤 2：运行测试确认失败**

Run: `npm run test -- src/server/__tests__/offers.test.ts`
Expected: FAIL with "selectOffer is not defined"

**步骤 3：实现帮助服务与路由**

Create `src/server/offers.ts` with create/select/cancel logic and status changes.
Add route handlers for offers and selection.

**步骤 4：运行测试**

Run: `npm run test -- src/server/__tests__/offers.test.ts`
Expected: PASS

**步骤 5：提交**

Run:
```bash
git add src/server/offers.ts src/app/api/offers src/app/api/requests/[id]/offers
git commit -m "feat: add help offers and selection"
```

### 任务 10：通知服务与路由

**文件：**
- Create: `src/server/notifications.ts`, `src/app/api/notifications/route.ts`, `src/app/api/notifications/[id]/read/route.ts`

**步骤 1：编写失败测试（通知创建）**

Create `src/server/__tests__/notifications.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { createNotification } from "../notifications";

it("creates notification", async () => {
  const note = await createNotification("user-id", "selected", { offerId: "o1" });
  expect(note.type).toBe("selected");
});
```

**步骤 2：运行测试确认失败**

Run: `npm run test -- src/server/__tests__/notifications.test.ts`
Expected: FAIL with "createNotification is not defined"

**步骤 3：实现通知服务与路由**

Create `src/server/notifications.ts` and API routes for list and read.

**步骤 4：运行测试**

Run: `npm run test -- src/server/__tests__/notifications.test.ts`
Expected: PASS

**步骤 5：提交**

Run:
```bash
git add src/server/notifications.ts src/app/api/notifications
git commit -m "feat: add notifications"
```

### 任务 11：前端 UI（使用 @frontend-design）

**文件：**
- Create/Modify: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`
- Create/Modify: `src/app/(main)/page.tsx`, `src/app/(main)/requests/new/page.tsx`, `src/app/(main)/requests/[id]/page.tsx`
- Create/Modify: `src/app/(main)/me/requests/page.tsx`, `src/app/(main)/me/offers/page.tsx`, `src/app/(main)/notifications/page.tsx`
- Create: `src/components/*`

**步骤 1：构建布局与导航**

Use @frontend-design to craft a distinctive, responsive layout (typography, color system, gradients/texture, motion).

**步骤 2：实现列表与筛选**

Render city/community filters and request cards with status tags.

**步骤 3：实现表单**

Publish form and “Help” modal with contact info defaults.

**步骤 4：手动冒烟测试**

Run: `npm run dev`
Expected: pages load on desktop/mobile widths, forms submit to API.

**步骤 5：提交**

Run:
```bash
git add src/app src/components
git commit -m "feat: build mvp UI"
```

---

计划已保存为 `docs/plans/2026-02-28-mutual-help-web-mvp.md`。

执行方式（已选 Subagent-Driven）：在本会话逐任务执行，并进行规格与代码质量两轮审核。
