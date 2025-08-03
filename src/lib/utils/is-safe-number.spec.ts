import { expect, test } from "vitest";
import { isSafeNumber } from "./is-safe-number";

test.each([
	0,
	1,
	1.12,
	Number.MAX_VALUE,
	Number.MIN_VALUE,
	Number.EPSILON,
	-1,
	-1.12,
	-Number.MAX_VALUE,
	-Number.MIN_VALUE,
])("returns 'true' for safe numbers", (value) => {
	expect(isSafeNumber(value), `failed for value: ${value.toString()}`).toEqual(true);
});

test.each([
	Number.NaN,
	Number.POSITIVE_INFINITY,
	Number.NEGATIVE_INFINITY,
	null,
	undefined,
	"some string",
	"123",
	true,
	false,
	{},
	[],
])("returns 'false' for unsafe numbers or non-numeric values", (value) => {
	expect(isSafeNumber(value), `failed for value: ${value}`).toEqual(false);
});
