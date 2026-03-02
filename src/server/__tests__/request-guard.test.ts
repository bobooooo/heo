import { expect, it } from "vitest";
import { getRequest } from "../requests";

it("returns null when request id is missing", async () => {
  await expect(getRequest(undefined as unknown as string)).resolves.toBeNull();
});
