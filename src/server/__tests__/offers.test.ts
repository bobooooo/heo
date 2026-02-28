import { afterAll, expect, it } from "vitest";
import { prisma } from "../../lib/prisma";
import { selectOffer } from "../offers";

let requestId = "";
let offerA = "";
let offerB = "";
let requesterId = "";
let helperAId = "";
let helperBId = "";
let communityId = "";
let cityId = "";

it("selects offer and rejects others", async () => {
  const requester = await prisma.user.create({
    data: { username: `req_${Date.now()}`, password: "test" },
  });
  requesterId = requester.id;

  const helperA = await prisma.user.create({
    data: { username: `helpA_${Date.now()}`, password: "test" },
  });
  helperAId = helperA.id;

  const helperB = await prisma.user.create({
    data: { username: `helpB_${Date.now()}`, password: "test" },
  });
  helperBId = helperB.id;

  const city = await prisma.city.create({ data: { name: "测试市" } });
  cityId = city.id;
  const community = await prisma.community.create({
    data: { name: "测试小区", cityId: city.id },
  });
  communityId = community.id;

  const request = await prisma.helpRequest.create({
    data: {
      userId: requester.id,
      cityId: city.id,
      communityId: community.id,
      time: new Date(),
      title: "陪诊",
      category: "陪诊",
      detail: "需要帮助",
      contactPhone: "123",
      contactWechat: "wx123",
    },
  });
  requestId = request.id;

  const offer1 = await prisma.helpOffer.create({
    data: {
      requestId: request.id,
      helperId: helperA.id,
      name: "甲",
      phone: "111",
      wechat: "wx1",
    },
  });
  offerA = offer1.id;

  const offer2 = await prisma.helpOffer.create({
    data: {
      requestId: request.id,
      helperId: helperB.id,
      name: "乙",
      phone: "222",
      wechat: "wx2",
    },
  });
  offerB = offer2.id;

  const result = await selectOffer(request.id, offer1.id);
  expect(result?.selectedId).toBe(offer1.id);

  const updatedOffers = await prisma.helpOffer.findMany({
    where: { requestId: request.id },
  });
  const selected = updatedOffers.find((o) => o.id === offer1.id);
  const rejected = updatedOffers.find((o) => o.id === offer2.id);
  expect(selected?.status).toBe("SELECTED");
  expect(rejected?.status).toBe("REJECTED");

  const updatedRequest = await prisma.helpRequest.findUnique({
    where: { id: request.id },
  });
  expect(updatedRequest?.status).toBe("MATCHED");
});

afterAll(async () => {
  if (offerA || offerB) {
    await prisma.helpOffer.deleteMany({
      where: { id: { in: [offerA, offerB].filter(Boolean) } },
    });
  }
  if (requestId) {
    await prisma.helpRequest.deleteMany({ where: { id: requestId } });
  }
  if (communityId) {
    await prisma.community.deleteMany({ where: { id: communityId } });
  }
  if (cityId) {
    await prisma.city.deleteMany({ where: { id: cityId } });
  }
  if (requesterId || helperAId || helperBId) {
    await prisma.user.deleteMany({
      where: { id: { in: [requesterId, helperAId, helperBId].filter(Boolean) } },
    });
  }
  await prisma.$disconnect();
});
