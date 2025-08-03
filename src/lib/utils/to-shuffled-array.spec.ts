import { describe, expect, test } from "bun:test";
import { shuffleArray, toShuffledArray } from "./to-shuffled-array";

describe("#" + shuffleArray.name, () => {
	test("mutates original array", () => {
		const input = Array.from({ length: 18 }, (_, idx) => idx);
		const copy = structuredClone(input);
		const result = shuffleArray(input);

		expect(result).not.toEqual(copy);
		expect(result).toEqual(input);
	});

	test("preserves all elements", () => {
		const input = Array.from({ length: 18 }, (_, idx) => idx);
		const copy = structuredClone(input);

		expect(input.toSorted()).toStrictEqual(copy.toSorted());
	});
});

describe("#" + toShuffledArray.name, () => {
	test("does not mutate original array", () => {
		const input = Array.from({ length: 18 }, (_, idx) => idx);
		const result = toShuffledArray(input);

		expect(result).not.toStrictEqual(input);
	});

	test("preserves all elements", () => {
		const input = Array.from({ length: 18 }, (_, idx) => idx);
		const copy = structuredClone(input);

		expect(input.toSorted()).toStrictEqual(copy.toSorted());
	});
});
