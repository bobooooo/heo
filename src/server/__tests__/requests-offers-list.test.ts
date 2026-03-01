import { afterAll, expect, it } from "vitest";
import { prisma } from "../../lib/prisma";
import { listOffersByUser } from "../offers";
import { listRequestsByUser } from "../requests";

const created = {
  users: [] as string[],
  cities: [] as string[],
  communities: [] as string[],
  requests: [] as string[],
  offers: [] as string[],
};

it("lists requests with offers for owner", async () => {
  const requester = await prisma.user.create({
    data: { username: `owner_${Date.now()}`, password: "test" },
  });
  const helper = await prisma.user.create({
    data: { username: `helper_${Date.now()}`, password: "test" },
  });
  created.users.push(requester.id, helper.id);

  const city = await prisma.city.create({ data: { name: "测试市" } });
  const community = await prisma.community.create({
    data: { name: "测试小区", cityId: city.id },
  });
  created.cities.push(city.id);
  created.communities.push(community.id);

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
  created.requests.push(request.id);

  const offer = await prisma.helpOffer.create({
    data: {
      requestId: request.id,
      helperId: helper.id,
      name: "甲",
      phone: "111",
      wechat: "wx1",
    },
  });
  created.offers.push(offer.id);

  const result = await listRequestsByUser(requester.id);
  expect(result.length).toBe(1);
  expect(result[0].offers.length).toBe(1);
  expect(result[0].city.name).toBe("测试市");
});

it("lists offers for helper", async () => {
  const requester = await prisma.user.create({
    data: { username: `owner2_${Date.now()}`, password: "test" },
  });
  const helper = await prisma.user.create({
    data: { username: `helper2_${Date.now()}`, password: "test" },
  });
  created.users.push(requester.id, helper.id);

  const city = await prisma.city.create({ data: { name: "测试市" } });
  const community = await prisma.community.create({
    data: { name: "测试小区", cityId: city.id },
  });
  created.cities.push(city.id);
  created.communities.push(community.id);

  const request = await prisma.helpRequest.create({
    data: {
      userId: requester.id,
      cityId: city.id,
      communityId: community.id,
      time: new Date(),
      title: "遛狗",
      category: "遛狗",
      detail: "需要帮助",
      contactPhone: "123",
      contactWechat: "wx123",
    },
  });
  created.requests.push(request.id);

  const offer = await prisma.helpOffer.create({
    data: {
      requestId: request.id,
      helperId: helper.id,
      name: "乙",
      phone: "222",
      wechat: "wx2",
    },
  });
  created.offers.push(offer.id);

  const result = await listOffersByUser(helper.id);
  expect(result.length).toBe(1);
  expect(result[0].request.title).toBe("遛狗");
});

afterAll(async () => {
  if (created.offers.length) {
    await prisma.helpOffer.deleteMany({
      where: { id: { in: created.offers } },
    });
  }
  if (created.requests.length) {
    await prisma.helpRequest.deleteMany({
      where: { id: { in: created.requests } },
    });
  }
  if (created.communities.length) {
    await prisma.community.deleteMany({
      where: { id: { in: created.communities } },
    });
  }
  if (created.cities.length) {
    await prisma.city.deleteMany({
      where: { id: { in: created.cities } },
    });
  }
  if (created.users.length) {
    await prisma.user.deleteMany({
      where: { id: { in: created.users } },
    });
  }
  await prisma.$disconnect();
});
