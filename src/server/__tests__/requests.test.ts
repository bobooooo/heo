import { afterAll, expect, it } from "vitest";
import { prisma } from "../../lib/prisma";
import { createRequest } from "../requests";

const username = `request_${Date.now()}`;
let requestId = "";
let communityId = "";
let cityId = "";
let userId = "";

it("creates help request", async () => {
  const user = await prisma.user.create({
    data: { username, password: "test" },
  });
  userId = user.id;

  const city = await prisma.city.create({ data: { name: "测试市" } });
  cityId = city.id;

  const community = await prisma.community.create({
    data: { name: "测试小区", cityId: city.id },
  });
  communityId = community.id;

  const req = await createRequest(user.id, {
    cityId: city.id,
    communityId: community.id,
    time: new Date().toISOString(),
    title: "陪诊",
    category: "陪诊",
    detail: "需要帮助",
    contactPhone: "123",
    contactWechat: "wx123",
  });

  requestId = req.id;
  expect(req.title).toBe("陪诊");
});

afterAll(async () => {
  if (requestId) {
    await prisma.helpRequest.deleteMany({ where: { id: requestId } });
  }
  if (communityId) {
    await prisma.community.deleteMany({ where: { id: communityId } });
  }
  if (cityId) {
    await prisma.city.deleteMany({ where: { id: cityId } });
  }
  if (userId) {
    await prisma.user.deleteMany({ where: { id: userId } });
  }
  await prisma.$disconnect();
});
