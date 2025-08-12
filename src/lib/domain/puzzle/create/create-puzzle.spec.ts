import { describe, expect, test } from "vitest";
import { createPuzzle } from "#src/lib/domain/puzzle/create/create-puzzle";
import { DIFFICULTY_LEVEL } from "#src/lib/domain/puzzle/difficulty/constants";

describe("#" + createPuzzle.name, () => {
	// TODO: enable all
	test.each(Object.values(DIFFICULTY_LEVEL).slice(0, 4))("creates puzzle", (expectedDifficulty) => {
		const left = createPuzzle(expectedDifficulty);

		expect(left.difficultyLevel).toEqual(expectedDifficulty);
		expect(left.id).not.toHaveLength(0);
	});
});
