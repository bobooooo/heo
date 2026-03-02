import path from "node:path";
import { readFile } from "node:fs/promises";
import { prisma } from "../src/lib/prisma";

type CityEntry = { code: string; city: string };
type CityData = {
  select_list: string[];
  city_list: Record<string, CityEntry[]>;
};

const DEFAULT_COMMUNITY = "不限";

async function loadCityNames(): Promise<string[]> {
  const filePath = path.resolve(__dirname, "../src/data/city_list.json");
  const raw = await readFile(filePath, "utf-8");
  const data = JSON.parse(raw) as CityData;
  const seen = new Set<string>();
  const names: string[] = [];

  for (const label of data.select_list) {
    if (label === "热门城市") {
      for (const item of data.city_list[label] ?? []) {
        if (item.city === "全国") continue;
        if (seen.has(item.city)) continue;
        seen.add(item.city);
        names.push(item.city);
      }
      continue;
    }

    for (const key of label.split("")) {
      for (const item of data.city_list[key] ?? []) {
        if (item.city === "全国") continue;
        if (seen.has(item.city)) continue;
        seen.add(item.city);
        names.push(item.city);
      }
    }
  }

  return names;
}

async function main() {
  const cityNames = await loadCityNames();

  for (const name of cityNames) {
    const city =
      (await prisma.city.findFirst({ where: { name } })) ??
      (await prisma.city.create({ data: { name } }));

    const community = await prisma.community.findFirst({
      where: { cityId: city.id, name: DEFAULT_COMMUNITY },
    });

    if (!community) {
      await prisma.community.create({
        data: { cityId: city.id, name: DEFAULT_COMMUNITY },
      });
    }
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
