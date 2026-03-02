import { prisma } from "../lib/prisma";
import { hashPassword } from "./auth/password";
import { createOffer, selectOffer } from "./offers";
import { completeRequest, createRequest } from "./requests";

const DEMO_PREFIX = "demo_";
const DEMO_TITLE_PREFIX = "【演示】";

type DemoCity = {
  id: string;
  communities: { id: string }[];
};

export async function ensureDemoLocations() {
  const existing = await prisma.city.findFirst({
    include: { communities: true },
  });
  if (existing?.communities.length) return existing as DemoCity;

  if (existing && existing.communities.length === 0) {
    await prisma.community.createMany({
      data: ["静安", "徐汇", "浦东"].map((name) => ({
        name,
        cityId: existing.id,
      })),
    });
    const updated = await prisma.city.findUnique({
      where: { id: existing.id },
      include: { communities: true },
    });
    return updated as DemoCity;
  }

  const city = await prisma.city.create({ data: { name: "上海" } });
  await prisma.community.createMany({
    data: ["静安", "徐汇", "浦东"].map((name) => ({
      name,
      cityId: city.id,
    })),
  });
  const created = await prisma.city.findUnique({
    where: { id: city.id },
    include: { communities: true },
  });
  return created as DemoCity;
}

export async function clearDemoData(userId: string) {
  const demoUsers = await prisma.user.findMany({
    where: { username: { startsWith: DEMO_PREFIX } },
    select: { id: true },
  });
  const demoUserIds = demoUsers.map((user) => user.id);

  const demoRequests = await prisma.helpRequest.findMany({
    where: {
      OR: [
        { userId: { in: demoUserIds } },
        { userId, title: { startsWith: DEMO_TITLE_PREFIX } },
      ],
    },
    select: { id: true },
  });
  const demoRequestIds = demoRequests.map((request) => request.id);

  if (demoRequestIds.length) {
    const userNotes = await prisma.notification.findMany({
      where: { userId },
    });
    const noteIds = userNotes
      .filter((note) => {
        const payload = note.payload as { requestId?: string };
        return payload?.requestId && demoRequestIds.includes(payload.requestId);
      })
      .map((note) => note.id);
    if (noteIds.length) {
      await prisma.notification.deleteMany({
        where: { id: { in: noteIds } },
      });
    }
  }

  await prisma.helpOffer.deleteMany({
    where: {
      OR: [
        { helperId: { in: demoUserIds } },
        { requestId: { in: demoRequestIds } },
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
  await prisma.session.deleteMany({
    where: { userId: { in: demoUserIds } },
  });
  await prisma.profile.deleteMany({
    where: { userId: { in: demoUserIds } },
  });
  await prisma.user.deleteMany({
    where: { id: { in: demoUserIds } },
  });
}

export async function seedDemoData(userId: string) {
  await clearDemoData(userId);
  const city = await ensureDemoLocations();
  const community = city?.communities[0];

  if (!city || !community) {
    throw new Error("缺少城市与小区数据");
  }

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
    update: {
      name: "演示发布者",
      phone: "13800000001",
      wechat: "demo_owner",
    },
    create: {
      userId: demoOwner.id,
      name: "演示发布者",
      phone: "13800000001",
      wechat: "demo_owner",
    },
  });
  await prisma.profile.upsert({
    where: { userId: demoHelper1.id },
    update: {
      name: "演示帮手A",
      phone: "13800000002",
      wechat: "demo_helper1",
    },
    create: {
      userId: demoHelper1.id,
      name: "演示帮手A",
      phone: "13800000002",
      wechat: "demo_helper1",
    },
  });
  await prisma.profile.upsert({
    where: { userId: demoHelper2.id },
    update: {
      name: "演示帮手B",
      phone: "13800000003",
      wechat: "demo_helper2",
    },
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

  await createRequest(demoOwner.id, {
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
