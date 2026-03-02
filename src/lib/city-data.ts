import cityData from "@/data/city_list.json";

export type CityEntry = {
  code: string;
  city: string;
};

export type CityGroup = {
  label: string;
  options: CityEntry[];
};

type CityData = {
  select_list: string[];
  city_list: Record<string, CityEntry[]>;
};

const data = cityData as CityData;

export function getGroupedCityOptions({
  includeNation = false,
}: {
  includeNation?: boolean;
} = {}): CityGroup[] {
  const seen = new Set<string>();

  return data.select_list
    .map((label) => {
      if (label === "热门城市") {
        const options = (data.city_list[label] ?? []).filter((item) => {
          if (!includeNation && item.city === "全国") return false;
          seen.add(item.city);
          return true;
        });
        return { label, options };
      }

      const options = label
        .split("")
        .flatMap((key) => data.city_list[key] ?? [])
        .filter((item) => {
          if (!includeNation && item.city === "全国") return false;
          if (seen.has(item.city)) return false;
          seen.add(item.city);
          return true;
        });

      return { label, options };
    })
    .filter((group) => group.options.length > 0);
}

export function getAllCityNames({
  includeNation = false,
}: {
  includeNation?: boolean;
} = {}): string[] {
  const groups = getGroupedCityOptions({ includeNation });
  return groups.flatMap((group) => group.options.map((item) => item.city));
}
