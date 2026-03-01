import { afterAll, expect, it } from "vitest";
import { prisma } from "../../lib/prisma";
import { createOffer, selectOffer } from "../offers";
import { cancelRequest, completeRequest } from "../requests";

const created = {
  users: [] as string[],
  cities: [] as string[],
  communities: [] as string[],
  requests: [] as string[],
  offers: [] as string[],
  notifications: [] as string[],
};

async function seedRequest() {
  const requester = await prisma.user.create({
    data: { username: `req_${Date.now()}`, password: "test" },
  });
  const helperA = await prisma.user.create({
    data: { username: `helpA_${Date.now()}`, password: "test" },
  });
  const helperB = await prisma.user.create({
    data: { username: `helpB_${Date.now()}`, password: "test" },
  });
  created.users.push(requester.id, helperA.id, helperB.id);

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

  return { requester, helperA, helperB, request };
}

it("creates notification when offer submitted", async () => {
  const { requester, helperA, request } = await seedRequest();

  const offer = await createOffer(request.id, helperA.id, {
    name: "甲",
    phone: "111",
    wechat: "wx1",
  });
  created.offers.push(offer.id);

  const notifications = await prisma.notification.findMany({
    where: { userId: requester.id },
  });
  notifications.forEach((note) => created.notifications.push(note.id));

  const submitted = notifications.find((note) => note.type === "offer_submitted");
  expect(submitted).toBeTruthy();
  expect((submitted?.payload as { requestId?: string })?.requestId).toBe(
    request.id
  );
});

it("selecting helper notifies selected and rejected", async () => {
  const { requester, helperA, helperB, request } = await seedRequest();

  const offerA = await createOffer(request.id, helperA.id, {
    name: "甲",
    phone: "111",
    wechat: "wx1",
  });
  const offerB = await createOffer(request.id, helperB.id, {
    name: "乙",
    phone: "222",
    wechat: "wx2",
  });
  created.offers.push(offerA.id, offerB.id);

  await selectOffer(request.id, offerA.id, requester.id);

  const helperNotes = await prisma.notification.findMany({
    where: { userId: { in: [helperA.id, helperB.id] } },
  });
  helperNotes.forEach((note) => created.notifications.push(note.id));

  const selectedNote = helperNotes.find(
    (note) => note.userId === helperA.id && note.type === "offer_selected"
  );
  const rejectedNote = helperNotes.find(
    (note) => note.userId === helperB.id && note.type === "offer_rejected"
  );

  expect(selectedNote).toBeTruthy();
  expect(rejectedNote).toBeTruthy();
});

it("canceling request notifies helpers", async () => {
  const { requester, helperA, helperB, request } = await seedRequest();

  const offerA = await createOffer(request.id, helperA.id, {
    name: "甲",
    phone: "111",
    wechat: "wx1",
  });
  const offerB = await createOffer(request.id, helperB.id, {
    name: "乙",
    phone: "222",
    wechat: "wx2",
  });
  created.offers.push(offerA.id, offerB.id);

  await cancelRequest(request.id, requester.id);

  const notes = await prisma.notification.findMany({
    where: { userId: { in: [helperA.id, helperB.id] } },
  });
  notes.forEach((note) => created.notifications.push(note.id));

  const canceledNotes = notes.filter((note) => note.type === "request_canceled");
  expect(canceledNotes.length).toBe(2);
});

it("completing request notifies selected helper", async () => {
  const { requester, helperA, request } = await seedRequest();

  const offer = await createOffer(request.id, helperA.id, {
    name: "甲",
    phone: "111",
    wechat: "wx1",
  });
  created.offers.push(offer.id);

  await selectOffer(request.id, offer.id, requester.id);
  await completeRequest(request.id, requester.id);

  const notes = await prisma.notification.findMany({
    where: { userId: helperA.id },
  });
  notes.forEach((note) => created.notifications.push(note.id));

  const completedNote = notes.find(
    (note) => note.type === "request_completed"
  );
  expect(completedNote).toBeTruthy();
});

afterAll(async () => {
  if (created.notifications.length) {
    await prisma.notification.deleteMany({
      where: { id: { in: created.notifications } },
    });
  }
  if (created.users.length) {
    await prisma.notification.deleteMany({
      where: { userId: { in: created.users } },
    });
  }
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
