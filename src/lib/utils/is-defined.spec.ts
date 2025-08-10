import { test, expect } from "vitest";
import { isDefined } from "./is-defined";

test.each([-1, 0, "", " ", {}, [], new Set(), new Map()])(
	"returns 'true' for non nil values",
	(value) => {
		expect(isDefined(value), `given value: ${value}`).toEqual(true);
	},
);

test.each([null, undefined])("returns 'false' for nil values", (value) => {
	expect(isDefined(value), `given value: ${value}`).toEqual(false);
});
