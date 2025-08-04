import { test, expect } from "vitest";
import { isNil } from "./is-nil";

test.each([-1, 0, "", " ", {}, [], new Set(), new Map()])(
	"returns 'false' for non nil values",
	(value) => {
		expect(isNil(value), `given value: ${value}`).toEqual(false);
	},
);

test.each([null, undefined])("returns 'true' for nil values", (value) => {
	expect(isNil(value), `given value: ${value}`).toEqual(true);
});
