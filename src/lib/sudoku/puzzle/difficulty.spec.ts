import { test, expect } from 'vitest';
import { GRID_CELLS_COUNT } from '@/lib/sudoku/grid';
import {
	TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL,
	LOWER_BOUND_OF_GIVEN_CELLS_IN_ROW_AND_COLUMN_BY_DIFFICULTY_LEVEL,
	DifficultyLevel,
} from './difficulty';
import type { PuzzleDifficultyLevel } from './types';

test.each([
	TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL,
	LOWER_BOUND_OF_GIVEN_CELLS_IN_ROW_AND_COLUMN_BY_DIFFICULTY_LEVEL,
])('object with difficulty rating has correct keys', (o) => {
	expect(Object.keys(DifficultyLevel)).to.deep.equal(Object.keys(o));
});

test('difficulty scales correctly', () => {
	const keys = Object.keys(TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL).map((it) => {
		return Number.parseInt(it);
	});
	const easiestLevel = Math.min(...keys) as PuzzleDifficultyLevel;
	const hardestLevel = Math.max(...keys) as PuzzleDifficultyLevel;

	expect(TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[hardestLevel][0] >= 17).to.equal(true);
	expect(TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[easiestLevel][1] < GRID_CELLS_COUNT).to.equal(
		true,
	);
});
