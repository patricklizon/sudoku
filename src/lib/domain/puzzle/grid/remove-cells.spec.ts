import { describe, expect, test } from 'vitest';

import { type Config, _isRowAndColMinimumCellCountSatisfied } from './remove-cells';

import { createEmptyGridCell, type Grid, GRID_SIZE } from '#src/lib/domain/puzzle/grid';

const _ = createEmptyGridCell();

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
			indexes: [],
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
			indexes: [],
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
			_isRowAndColMinimumCellCountSatisfied({ minimumGivenCells, indexes: [] }, puzzle, {
				colIdx: 0,
				rowIdx: 0,
			}),
		).to.equal(true);
	});
});
