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
