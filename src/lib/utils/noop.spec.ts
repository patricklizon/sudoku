import { expect, test } from "bun:test";
import { noop } from "./noop";

test("returns nothing", () => {
	expect(noop()).toBeOneOf([null, undefined]);
});
