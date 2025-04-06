import { describe, expect, test } from 'vitest';

import { createEmptyGridCell, createEmptyGrid, fillDiagonalGridBoxesWithValues } from './grid';
import { mapGridToGridWithPossibleValues } from './mappers';
import { findCellIdxWithSmallestCountOfPossibleValues, hasUniqueSolution, solve } from './solve';
import type { Grid, GridFilled } from './types';

describe(solve.name, () => {
	test('fills only empty fields of grid producing solution, without mutating input', () => {
		const _ = createEmptyGridCell();
		const input = [
			[1, 3, 8, _, _, _, _, _, _],
			[4, 6, 9, _, _, _, _, _, _],
			[2, 5, 7, _, _, _, _, _, _],
			[_, _, _, 7, 9, 8, _, _, _],
			[_, _, _, 6, 5, 4, _, _, _],
			[_, _, _, 3, 2, 1, _, _, _],
			[_, _, _, _, _, _, 1, 8, 6],
			[_, _, _, _, _, _, 3, 2, 5],
			[_, _, _, _, _, _, 4, 7, 9],
		].flat() as Grid;

		const left = solve(input);
		const right = [
			[1, 3, 8, 5, 4, 7, 9, 6, 2],
			[4, 6, 9, 1, 8, 2, 5, 3, 7],
			[2, 5, 7, 9, 3, 6, 8, 1, 4],
			[5, 1, 6, 7, 9, 8, 2, 4, 3],
			[3, 8, 2, 6, 5, 4, 7, 9, 1],
			[7, 9, 4, 3, 2, 1, 6, 5, 8],
			[9, 4, 3, 2, 7, 5, 1, 8, 6],
			[8, 7, 1, 4, 6, 9, 3, 2, 5],
			[6, 2, 5, 8, 1, 3, 4, 7, 9],
		].flat() as GridFilled;

		expect(left).to.deep.equal(right);
		expect(input).not.to.deep.equal(right);
	});

	test.each(Array.from({ length: 10 }, () => [createEmptyGrid()]))(
		'should not throw an error when filling a randomly generated grid',
		(grid) => {
			fillDiagonalGridBoxesWithValues(grid);

			expect(() => {
				solve(grid);
			}).not.toThrowError();
		},
	);
});

describe(hasUniqueSolution.name, () => {
	test("returns 'false' when multiple solutions exists", () => {
		const _ = createEmptyGridCell();
		const puzzle = [
			[9, 2, 6, 5, 7, 1, 4, 8, 3],
			[3, 5, 1, 4, 8, 6, 2, 7, 9],
			[8, 7, 4, 9, 2, 3, 5, 1, 6],
			[5, 8, 2, 3, 6, 7, 1, 9, 4],
			[1, 4, 9, 2, 5, 8, 3, 6, 7], // two possible solutions
			[7, 6, 3, 1, _, _, 8, 2, 5], // [4, 9] or [9, 4]
			[2, 3, 8, 7, _, _, 6, 5, 1], // [9, 4]    [4, 9]
			[6, 1, 7, 8, 3, 5, 9, 4, 2],
			[4, 9, 5, 6, 1, 2, 7, 3, 8],
		].flat() as Grid;

		expect(hasUniqueSolution(puzzle)).to.equal(false);
	});

	test("returns 'true' when only one solution exists", () => {
		const _ = createEmptyGridCell();
		const puzzle = [
			[5, 3, _, _, 7, _, _, _, _],
			[6, _, _, 1, 9, 5, _, _, _],
			[_, 9, 8, _, _, _, _, 6, _],
			[8, _, _, _, 6, _, _, _, 3],
			[4, _, _, 8, _, 3, _, _, 1],
			[7, _, _, _, 2, _, _, _, 6],
			[_, 6, _, _, _, _, 2, 8, _],
			[_, _, _, 4, 1, 9, _, _, 5],
			[_, _, _, _, 8, _, _, 7, 9],
		].flat() as Grid;

		expect(hasUniqueSolution(puzzle)).to.equal(true);
	});
});

describe(findCellIdxWithSmallestCountOfPossibleValues.name, () => {
	test('returns first index when all cells are empty', () => {
		const expectedIdx = 0;
		const grid = mapGridToGridWithPossibleValues(createEmptyGrid());
		const left = findCellIdxWithSmallestCountOfPossibleValues(grid);

		expect(left).to.equal(expectedIdx);
	});

	test('returns correct index when some cells have less possibilities', () => {
		const expectedIdx = 33;
		const grid = mapGridToGridWithPossibleValues(createEmptyGrid());

		grid[expectedIdx] = new Set([1, 4, 5]);
		const left = findCellIdxWithSmallestCountOfPossibleValues(grid);

		expect(left).to.equal(expectedIdx);
	});
});
