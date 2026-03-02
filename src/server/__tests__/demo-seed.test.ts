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
