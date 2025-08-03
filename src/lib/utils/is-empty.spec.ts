import { test, expect } from "vitest";
import { isEmpty } from "./is-empty";

test.each([[], new Array(), new Set(), new Map(), "", null, undefined])(
	"returns 'true' for empty data structures",
	(value) => {
		expect(isEmpty(value)).toEqual(true);
	},
);

test.each([
	123_341_232,
	[1, 2, 4],
	new Array({ length: 2 }),
	new Set([1, "2"]),
	new Map([["a", 1]]),
	Symbol("1234"),
	"test",
	1,
])("returns 'false' for non-empty data structures", (value) => {
	expect(isEmpty(value)).toEqual(false);
});
