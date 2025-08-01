import { expect, test } from "vitest";
import { noop } from "./noop";

test("returns nothing", () => {
	expect(noop()).toBeOneOf([null, undefined]);
});
