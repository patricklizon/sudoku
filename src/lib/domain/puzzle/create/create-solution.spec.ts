import { describe, expect, test } from 'vitest';
import {
	GRID_CELLS_COUNT,
	GRID_SIZE,
	type GridCellCoordinates,
	type GridFilled,
	isGridCellFilled,
	isGridCellValueCorrectAtCoordinates,
	readGridCol,
	readGridRow,
} from '../grid';
import { createPuzzleSolved, createPuzzleUnsolved, isValueValid } from './create-solution';
import {
	DIFFICULTY_LEVEL,
	MINIMUM_GIVEN_CELLS_COUNT_IN_LINE_BY_DIFFICULTY_LEVEL,
	type PuzzleDifficultyLevelScore,
	TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL,
} from '@/lib/domain/puzzle-difficulty';

describe(createPuzzleSolved.name, () => {
	test('generates correct puzzle', () => {
		const solvedPuzzle = createPuzzleSolved();

		expect(solvedPuzzle).to.have.length(GRID_CELLS_COUNT);
		expect(solvedPuzzle.every(Number.isInteger)).to.equal(true);

		for (let rowIdx = 0; rowIdx < GRID_SIZE; rowIdx++) {
			for (let colIdx = 0; colIdx < GRID_SIZE; colIdx++) {
				expect(isGridCellValueCorrectAtCoordinates(solvedPuzzle, { rowIdx, colIdx }));
			}
		}
	});
});

// TODO: Object.values(DIFFICULTY_LEVEL)
describe.each<PuzzleDifficultyLevelScore>([
	DIFFICULTY_LEVEL[1],
	DIFFICULTY_LEVEL[2],
	DIFFICULTY_LEVEL[3],
])(createPuzzleUnsolved.name, (level) => {
	const p = structuredClone(
		[
			[7, 6, 5, 1, 2, 8, 3, 4, 9],
			[3, 9, 1, 4, 5, 6, 2, 8, 7],
			[2, 4, 8, 3, 9, 7, 1, 5, 6],
			[1, 2, 6, 8, 7, 3, 5, 9, 4],
			[5, 7, 9, 2, 6, 4, 8, 3, 1],
			[4, 8, 3, 5, 1, 9, 7, 6, 2],
			[6, 1, 4, 7, 3, 5, 9, 2, 8],
			[9, 5, 2, 6, 8, 1, 4, 7, 3],
			[8, 3, 7, 9, 4, 2, 6, 1, 5],
		].flat(),
	) as GridFilled;
	const puzzle = createPuzzleUnsolved(p, level);

	test(`creates correct amount of holes for difficulty level '${level.toString()}'`, () => {
		const left = puzzle.filter(isGridCellFilled);

		expect(left)
			.to.have.length.of.at.least(TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[level]![0])
			.and.at.most(TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[level]![1]);
	});

	test.each(Array.from({ length: GRID_SIZE }, (_, idx) => idx))(
		`removes correct amount of elements from rows and cols for given difficulty level (${level.toString()})`,
		(idx) => {
			const cellsFilledCount = MINIMUM_GIVEN_CELLS_COUNT_IN_LINE_BY_DIFFICULTY_LEVEL[level]!;

			expect(
				readGridRow(puzzle, { colIdx: 0, rowIdx: idx }).filter(isGridCellFilled),
			).to.have.length.of.at.least(cellsFilledCount);
			expect(
				readGridCol(puzzle, { colIdx: idx, rowIdx: 0 }).filter(isGridCellFilled),
			).to.have.length.of.at.least(cellsFilledCount);
		},
	);
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
	].flat() as GridFilled;

	test.each<
		[coordinates: GridCellCoordinates, val: number, expectedResult: ReturnType<typeof isValueValid>]
	>([
		[{ rowIdx: 0, colIdx: 0 }, 8, false],
		[{ rowIdx: 1, colIdx: 1 }, 6, false],
		[{ rowIdx: 8, colIdx: 3 }, 6, false],
		[{ rowIdx: 0, colIdx: 0 }, 7, true],
		[{ rowIdx: 1, colIdx: 1 }, 9, true],
		[{ rowIdx: 8, colIdx: 3 }, 9, true],
	])('%j returns correct value when passing %d', (coordinates, val, expected) => {
		expect(isValueValid(puzzleSolved, coordinates, val)).to.equal(expected);
	});
});
