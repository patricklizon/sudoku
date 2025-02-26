import { describe, expect, test } from 'vitest';
import { createPuzzle } from '@/lib/domain/puzzle/create/create-puzzle';
import { DIFFICULTY_LEVEL } from '@/lib/domain/puzzle/difficulty';

describe(createPuzzle.name, () => {
	// TODO: enable all
	test.each(Object.values(DIFFICULTY_LEVEL).slice(0, 3))('creates puzzle', (expectedDifficulty) => {
		const left = createPuzzle(expectedDifficulty);

		expect(left.difficulty).to.equal(expectedDifficulty);
		expect(left.id).not.to.be.empty;
	});
});
