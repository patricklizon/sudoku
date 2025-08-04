import { expect, test } from "vitest";
import { getRandomInt } from "./get-random-int";

test("returns numbers in range", () => {
	const max = 10;
	const triesCount = 20;
	for (let i = 0; i < triesCount; i++) {
		expect(getRandomInt(max)).toBeGreaterThanOrEqual(0);
		expect(getRandomInt(max)).toBeLessThanOrEqual(max);
	}

	expect.assertions(2 * triesCount);
});
