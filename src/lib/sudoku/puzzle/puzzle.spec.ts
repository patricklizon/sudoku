import { describe, expect, test } from 'vitest';
import { GRID_CELLS_COUNT, GRID_SIZE, isValueCorrectForCellAtPosition } from '@/lib/sudoku/grid';
import { createSolvedPuzzle, isValueValid } from './puzzle';
import type { PuzzleSolved } from './types';

describe(createSolvedPuzzle.name, () => {
	test('generates correct puzzle', () => {
		const solvedPuzzle = createSolvedPuzzle();

		expect(solvedPuzzle).to.have.length(GRID_CELLS_COUNT);
		expect(solvedPuzzle.every(Number.isInteger)).to.equal(true);

		for (let rowIdx = 0; rowIdx < GRID_SIZE; rowIdx++) {
			for (let colIdx = 0; colIdx < GRID_SIZE; colIdx++) {
				expect(isValueCorrectForCellAtPosition(solvedPuzzle, rowIdx, colIdx));
			}
		}
	});
});

describe(isValueValid.name, () => {
	const puzzleSolved = [
		[7, 6, 5, 1, 2, 8, 3, 4, 9],
		[3, 9, 1, 4, 5, 6, 2, 8, 7],
		[2, 4, 8, 3, 9, 7, 1, 5, 6],
		[1, 2, 6, 8, 7, 3, 5, 9, 4],
		[5, 7, 9, 2, 6, 4, 8, 3, 1],
		[4, 8, 3, 5, 1, 9, 7, 6, 2],
		[6, 1, 4, 7, 3, 5, 9, 2, 8],
		[9, 5, 2, 6, 8, 1, 4, 7, 3],
		[8, 3, 7, 9, 4, 2, 6, 1, 5],
	].flat() as PuzzleSolved;

	type TestCase = [
		rowIdx: number,
		colIdx: number,
		val: number,
		expectedResult: ReturnType<typeof isValueValid>,
	];

	test.each<TestCase>([
		[0, 0, 8, false],
		[1, 1, 6, false],
		[8, 3, 6, false],
		[0, 0, 7, true],
		[1, 1, 9, true],
		[8, 3, 9, true],
	])('(%d, %d) returns correct value when passing %d', (rowIdx, colIdx, val, expected) => {
		expect(isValueValid(puzzleSolved, rowIdx, colIdx, val)).to.equal(expected);
	});
});
