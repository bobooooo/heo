import { expect, it } from "vitest";
import { getRequestDetailHref, getRequestHelpHref } from "../request-links";

it("builds detail href", () => {
  expect(getRequestDetailHref("123")).toBe("/requests/123");
});

it("builds help href with anchor", () => {
  expect(getRequestHelpHref("123")).toBe("/requests/123#help");
});
