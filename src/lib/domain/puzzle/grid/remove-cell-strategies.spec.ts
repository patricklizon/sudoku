import { describe, expect, test } from 'vitest';
import { createEmptyCell, type Grid, GRID_SIZE } from '@/lib/domain/puzzle/grid';
import {
	type Config,
	hasUniqueSolution,
	isRowAndColMinimumCellCountSatisfied,
} from './remove-cell-strategies';

const _ = createEmptyCell();

describe(hasUniqueSolution.name, () => {
	test("returns 'false' when multiple solutions exists", () => {
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

describe(isRowAndColMinimumCellCountSatisfied.name, () => {
	const puzzle = [
		[9, 2, 6, 5, 7, 1, _, 8, 3],
		[3, 5, 1, _, 8, 6, 2, 7, 9],
		[8, 7, _, 9, 2, 3, _, 1, 6],
		[5, 8, 2, 3, _, 7, 1, 9, 4],
		[1, 4, 9, 2, 5, _, 1, 6, 7],
		[7, 6, 3, 1, 4, 9, 1, 2, 5],
		[2, 3, _, 7, 5, 1, 2, 1, 1],
		[6, 1, 7, 8, 9, 5, _, 4, 2],
		[4, 9, 5, 6, 1, 2, _, 3, _],
	].flat() as Grid;

	const diagonalIdxs = Array.from({ length: GRID_SIZE }, (_, idx) => idx);

	describe("when puzzle satisfies configuration's constrains", () => {
		const config: Config = {
			minimumGivenCells: { total: { count: 20, range: [19, 21] }, col: 5, row: 7 },
		};

		test.each(diagonalIdxs)('returns true at index %d', (idx) => {
			expect(
				isRowAndColMinimumCellCountSatisfied(config, puzzle, {
					colIdx: idx,
					rowIdx: idx,
				}),
			).to.equal(true);
		});
	});

	describe("when puzzle does not satisfy config's constarains", () => {
		const configuration: Config = {
			minimumGivenCells: { total: { count: 20, range: [19, 21] }, col: 9, row: 9 },
		};

		test.each(diagonalIdxs)("returns 'false' at index %d", (idx) => {
			expect(
				isRowAndColMinimumCellCountSatisfied(configuration, puzzle, {
					colIdx: idx,
					rowIdx: idx,
				}),
			).to.equal(false);
		});
	});

	test.each<[config: Config['minimumGivenCells']]>([
		[{ total: { count: 81, range: [80, 81] }, col: 0, row: 0 }],
		[{ total: { count: 20, range: [19, 20] }, col: 0, row: 0 }],
		[{ total: { count: -1, range: [-10, 10] }, col: 0, row: 0 }],
		[{ total: { count: 999, range: [900, 999] }, col: 0, row: 0 }],
	])('amount of minimal total given fields should not affect the result', (minimumGivenCells) => {
		expect(
			isRowAndColMinimumCellCountSatisfied({ minimumGivenCells }, puzzle, {
				colIdx: 0,
				rowIdx: 0,
			}),
		).to.equal(true);
	});
});
