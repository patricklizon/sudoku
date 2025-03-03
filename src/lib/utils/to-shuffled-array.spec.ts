import { describe, expect, test } from 'vitest';

import { shuffleArray, toShuffledArray } from './to-shuffled-array';

describe(shuffleArray.name, () => {
	test('mutates original array', () => {
		const input = Array.from({ length: 18 }, (_, idx) => idx);
		const copy = structuredClone(input);
		const result = shuffleArray(input);

		expect(result).not.to.be.deep.equal(copy);
		expect(result).to.equal(input);
	});

	test('preserves all elements', () => {
		const input = Array.from({ length: 18 }, (_, idx) => idx);
		const copy = structuredClone(input);

		expect(input.toSorted()).to.deep.equal(copy.toSorted());
	});
});

describe(toShuffledArray.name, () => {
	test('does not mutate original array', () => {
		const input = Array.from({ length: 18 }, (_, idx) => idx);
		const result = toShuffledArray(input);

		expect(result).not.to.be.deep.equal(input);
	});

	test('preserves all elements', () => {
		const input = Array.from({ length: 18 }, (_, idx) => idx);
		const copy = structuredClone(input);

		expect(input.toSorted()).to.deep.equal(copy.toSorted());
	});
});
