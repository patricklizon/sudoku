import { expect, test } from "vitest";
import { isEven } from "./is-even";

test.each([0, 2, 4, 10, 12])("returns 'true' for even numbers", (value) => {
	expect(isEven(value), `given value: ${value}`).toEqual(true);
});

test.each([1, 3, 11, 13])("returns 'false' for odd numbers", (value) => {
	expect(isEven(value), `given value: ${value}`).toEqual(false);
});
