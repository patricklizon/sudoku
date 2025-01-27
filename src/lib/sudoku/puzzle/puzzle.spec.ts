import { describe, expect, test } from 'vitest';
import {
	GRID_CELLS_COUNT,
	GRID_SIZE,
	isGridCellValueCorrectAtCoordinates,
	createEmptyCell,
	type Grid,
	type GridFilled,
	type GridCellCoordinates,
} from '@/lib/sudoku/grid';
import { createSolvedPuzzle, isValueValid, fillPuzzle } from './puzzle';
import type { PuzzleSolved } from './types';

describe(fillPuzzle.name, () => {
	test('fills only empty fields of grid producing solution', () => {
		const _ = createEmptyCell();
		const left = structuredClone(
			[
				[7, 6, 5, _, _, _, _, _, _],
				[3, 9, 1, _, _, _, _, _, _],
				[2, 4, 8, _, _, _, _, _, _],
				[_, _, _, 8, 7, 3, _, _, _],
				[_, _, _, 2, 6, 4, _, _, _],
				[_, _, _, 5, 1, 9, _, _, _],
				[_, _, _, _, _, _, 9, 2, 8],
				[_, _, _, _, _, _, 4, 7, 3],
				[_, _, _, _, _, _, 6, 1, 5],
			].flat(),
		) as Grid;

		const right = [
			[7, 6, 5, 1, 2, 8, 3, 4, 9],
			[3, 9, 1, 4, 5, 6, 2, 8, 7],
			[2, 4, 8, 3, 9, 7, 1, 5, 6],
			[1, 2, 6, 8, 7, 3, 5, 9, 4],
			[5, 7, 9, 2, 6, 4, 8, 3, 1],
			[4, 8, 3, 5, 1, 9, 7, 6, 2],
			[6, 1, 4, 7, 3, 5, 9, 2, 8],
			[9, 5, 2, 6, 8, 1, 4, 7, 3],
			[8, 3, 7, 9, 4, 2, 6, 1, 5],
		].flat() as GridFilled;

		fillPuzzle(left, 0);

		expect(left).to.deep.equal(right);
	});
});

describe(createSolvedPuzzle.name, () => {
	test('generates correct puzzle', () => {
		const solvedPuzzle = createSolvedPuzzle();

		expect(solvedPuzzle).to.have.length(GRID_CELLS_COUNT);
		expect(solvedPuzzle.every(Number.isInteger)).to.equal(true);

		for (let rowIdx = 0; rowIdx < GRID_SIZE; rowIdx++) {
			for (let colIdx = 0; colIdx < GRID_SIZE; colIdx++) {
				expect(isGridCellValueCorrectAtCoordinates(solvedPuzzle, { rowIdx, colIdx }));
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
		coordinates: GridCellCoordinates,
		val: number,
		expectedResult: ReturnType<typeof isValueValid>,
	];

	test.each<TestCase>([
		[{ rowIdx: 0, colIdx: 0 }, 8, false],
		[{ rowIdx: 1, colIdx: 1 }, 6, false],
		[{ rowIdx: 8, colIdx: 3 }, 6, false],
		[{ rowIdx: 0, colIdx: 0 }, 7, true],
		[{ rowIdx: 1, colIdx: 1 }, 9, true],
		[{ rowIdx: 8, colIdx: 3 }, 9, true],
	])('%j returns correct value when passing %d', ({ rowIdx, colIdx }, val, expected) => {
		expect(isValueValid(puzzleSolved, rowIdx, colIdx, val)).to.equal(expected);
	});
});
