import { expect, test } from "bun:test";
import { GRID_CELL_COUNT } from "#src/lib/domain/puzzle/grid/constants";
import type { PuzzleDifficultyLevel } from "#src/lib/domain/puzzle/types";
import {
	DIFFICULTY_LEVEL,
	MINIMUM_GIVEN_CELLS_COUNT_IN_LINE_BY_DIFFICULTY_LEVEL,
	TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL,
} from "./constants";

test.each([
	TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL,
	MINIMUM_GIVEN_CELLS_COUNT_IN_LINE_BY_DIFFICULTY_LEVEL,
])("object with difficulty rating has correct keys", (o) => {
	expect(Object.keys(DIFFICULTY_LEVEL)).toStrictEqual(Object.keys(o));
});

test("amount of given cells scales down by difficulty", () => {
	const levels = (
		Object.keys(TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL) as unknown as PuzzleDifficultyLevel[]
	).sort();

	const easiest = levels.at(0)!;
	const hardest = levels.at(-1)!;
	const givenCellsForEasiestLevel = TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[easiest]!;
	const givenCellsForHardestLevel = TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[hardest]!;

	expect(givenCellsForHardestLevel[0] >= 17).toEqual(true);
	expect(givenCellsForEasiestLevel[1] < GRID_CELL_COUNT).toEqual(true);

	for (let idx = 1; idx < levels.length; idx++) {
		const currentLevel = levels[idx]!;

		expect(TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[currentLevel]![0]).toBeLessThan(
			TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[currentLevel]![1],
		);

		const prevLevel = levels[idx - 1]!;

		expect(TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[prevLevel]![1]).toBeGreaterThan(
			TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[currentLevel]![0],
		);
	}
});
