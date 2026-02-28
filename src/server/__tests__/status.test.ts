import { expect, it } from "vitest";
import { applySelection } from "../status";

it("selecting a helper marks others rejected", () => {
  const result = applySelection({
    offers: ["a", "b", "c"],
    selectedId: "b",
  });
  expect(result.selected).toBe("b");
  expect(result.rejected).toEqual(["a", "c"]);
});
