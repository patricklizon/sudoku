import { test, expect } from 'vitest';
import { GRID_CELLS_COUNT } from '@/lib/sudoku/grid';
import {
	TOTAL_GIVEN_CELLS_RANGE_BY_LEVEL,
	MINIMUM_GIVEN_CELLS_COUNT_IN_LINE_BY_LEVEL,
	DIFFICULTY_LEVEL,
} from './difficulty';
import type { DifficultyLevelScore } from './types';

test.each([TOTAL_GIVEN_CELLS_RANGE_BY_LEVEL, MINIMUM_GIVEN_CELLS_COUNT_IN_LINE_BY_LEVEL])(
	'object with difficulty rating has correct keys',
	(o) => {
		expect(Object.keys(DIFFICULTY_LEVEL)).to.deep.equal(Object.keys(o));
	},
);

test('amount of given cells scales down by difficulty', () => {
	const levels = (
		Object.keys(TOTAL_GIVEN_CELLS_RANGE_BY_LEVEL) as unknown as DifficultyLevelScore[]
	).sort();

	const easiest = levels.at(0)!;
	const hardest = levels.at(-1)!;
	const givenCellsForEasiestLevel = TOTAL_GIVEN_CELLS_RANGE_BY_LEVEL[easiest]!;
	const givenCellsForHardestLevel = TOTAL_GIVEN_CELLS_RANGE_BY_LEVEL[hardest]!;

	expect(givenCellsForHardestLevel[0] >= 17).to.equal(true);
	expect(givenCellsForEasiestLevel[1] < GRID_CELLS_COUNT).to.equal(true);

	for (let idx = 1; idx < levels.length; idx++) {
		const currentLevel = levels[idx]!;

		expect(TOTAL_GIVEN_CELLS_RANGE_BY_LEVEL[currentLevel]![0]).to.be.lessThan(
			TOTAL_GIVEN_CELLS_RANGE_BY_LEVEL[currentLevel]![1],
		);

		const prevLevel = levels[idx - 1]!;

		expect(TOTAL_GIVEN_CELLS_RANGE_BY_LEVEL[prevLevel]![1]).to.be.greaterThan(
			TOTAL_GIVEN_CELLS_RANGE_BY_LEVEL[currentLevel]![0],
		);
	}
});
