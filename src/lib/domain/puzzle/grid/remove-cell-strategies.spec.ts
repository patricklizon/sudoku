import { describe, expect, test } from 'vitest';
import { createEmptyCell, type Grid, GRID_SIZE, type GridFilled } from '@/lib/domain/puzzle/grid';
import {
	type Config,
	_isRowAndColMinimumCellCountSatisfied,
	removeCellsJumpingByOneCell,
} from './remove-cell-strategies';
import { DIFFICULTY_LEVEL } from '../difficulty';

const _ = createEmptyCell();

describe(_isRowAndColMinimumCellCountSatisfied.name, () => {
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
			difficulty: DIFFICULTY_LEVEL[1],
		};

		test.each(diagonalIdxs)('returns true at index %d', (idx) => {
			expect(
				_isRowAndColMinimumCellCountSatisfied(config, puzzle, {
					colIdx: idx,
					rowIdx: idx,
				}),
			).to.equal(true);
		});
	});

	describe("when puzzle does not satisfy config's constarains", () => {
		const configuration: Config = {
			minimumGivenCells: { total: { count: 20, range: [19, 21] }, col: 9, row: 9 },
			difficulty: DIFFICULTY_LEVEL[1],
		};

		test.each(diagonalIdxs)("returns 'false' at index %d", (idx) => {
			expect(
				_isRowAndColMinimumCellCountSatisfied(configuration, puzzle, {
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
			_isRowAndColMinimumCellCountSatisfied(
				{ minimumGivenCells, difficulty: DIFFICULTY_LEVEL[1] },
				puzzle,
				{
					colIdx: 0,
					rowIdx: 0,
				},
			),
		).to.equal(true);
	});
});

describe(removeCellsJumpingByOneCell.name, () => {
	test.each<GridFilled[]>([
		[
			[
				2, 4, 1, 5, 3, 8, 7, 6, 9, 3, 5, 9, 7, 6, 4, 8, 1, 2, 6, 7, 8, 9, 1, 2, 4, 5, 3, 1, 2, 7, 8,
				5, 9, 6, 3, 4, 9, 3, 4, 6, 2, 7, 5, 8, 1, 5, 8, 6, 1, 4, 3, 2, 9, 7, 7, 6, 5, 4, 9, 1, 3, 2,
				8, 4, 9, 3, 2, 8, 6, 1, 7, 5, 8, 1, 2, 3, 7, 5, 9, 4, 6,
			],
			[
				7, 8, 3, 4, 1, 9, 2, 5, 6, 9, 1, 6, 5, 8, 2, 7, 3, 4, 5, 4, 2, 3, 6, 7, 1, 9, 8, 3, 7, 9, 2,
				4, 5, 6, 8, 1, 8, 6, 4, 1, 7, 3, 9, 2, 5, 2, 5, 1, 6, 9, 8, 4, 7, 3, 6, 3, 5, 9, 2, 4, 8, 1,
				7, 4, 2, 8, 7, 5, 1, 3, 6, 9, 1, 9, 7, 8, 3, 6, 5, 4, 2,
			],
			[
				2, 5, 8, 3, 9, 6, 1, 4, 7, 1, 3, 9, 7, 5, 4, 2, 8, 6, 7, 4, 6, 2, 1, 8, 3, 5, 9, 8, 1, 5, 6,
				3, 9, 4, 7, 2, 4, 6, 7, 1, 2, 5, 9, 3, 8, 3, 9, 2, 4, 8, 7, 6, 1, 5, 5, 8, 3, 9, 6, 1, 7, 2,
				4, 9, 7, 1, 8, 4, 2, 5, 6, 3, 6, 2, 4, 5, 7, 3, 8, 9, 1,
			],
		] as GridFilled[],
	])('removes cells for problematic config', (g) => {
		expect(() => {
			removeCellsJumpingByOneCell(g, {
				minimumGivenCells: {
					col: 3,
					row: 3,
					total: {
						count: 32,
						range: [32, 32],
					},
				},
				difficulty: DIFFICULTY_LEVEL[3],
			});
		}).not.toThrowError();
	});
});
