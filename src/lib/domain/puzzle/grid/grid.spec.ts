import { describe, expect, test } from 'vitest';

import { GRID_SIZE, GRID_BOX_CELLS_COUNT, GRID_BOX_SIZE } from './constants';
import { ValueOutOfRangeError } from './errors';
import {
	createEmptyGridCell,
	createEmptyGrid,
	createEmptyGridBox,
	fillDiagonalGridBoxesWithValues,
	getAllowedGridCellValuesAt,
	readGridBoxCellsAt,
	readGridCellIndexesOfGridBoxAt,
	isGridCellValueCorrectAt,
} from './grid';
import { isGridCellEmpty, isGridCellFilled } from './predicates';
import type { Grid, GridCellCoordinates, GridFilled, GridRow } from './types';

describe(readGridBoxCellsAt.name, () => {
	type TestData = Record<'middle' | 'left' | 'right', GridRow>;

	const top = {
		left: [111, 112, 113, 121, 122, 123, 131, 132, 133],
		middle: [221, 222, 223, 224, 225, 226, 227, 228, 229],
		right: [331, 332, 333, 341, 342, 343, 351, 352, 353],
	} satisfies TestData;

	const middle = {
		left: [411, 412, 413, 421, 422, 423, 431, 432, 433],
		middle: [511, 512, 513, 521, 522, 523, 531, 532, 533],
		right: [611, 612, 613, 621, 622, 623, 631, 632, 633],
	} satisfies TestData;

	const bottom = {
		left: [711, 712, 713, 721, 722, 723, 731, 732, 733],
		middle: [811, 812, 813, 821, 822, 823, 831, 832, 833],
		right: [911, 912, 913, 921, 922, 923, 931, 932, 933],
	} satisfies TestData;

	const grid = [
		[111, 112, 113, 221, 222, 223, 331, 332, 333],
		[121, 122, 123, 224, 225, 226, 341, 342, 343],
		[131, 132, 133, 227, 228, 229, 351, 352, 353],
		[411, 412, 413, 511, 512, 513, 611, 612, 613],
		[421, 422, 423, 521, 522, 523, 621, 622, 623],
		[431, 432, 433, 531, 532, 533, 631, 632, 633],
		[711, 712, 713, 811, 812, 813, 911, 912, 913],
		[721, 722, 723, 821, 822, 823, 921, 922, 923],
		[731, 732, 733, 831, 832, 833, 931, 932, 933],
	].flat() as Grid;

	test.each<[testCaseName: string, rowIdx: number, colIdx: number, expected: number[]]>([
		['top-left', 0, 0, top.left],
		['top-left', 0, 1, top.left],
		['top-left', 0, 2, top.left],
		['top-left', 1, 0, top.left],
		['top-left', 1, 1, top.left],
		['top-left', 1, 2, top.left],
		['top-left', 2, 0, top.left],
		['top-left', 2, 1, top.left],
		['top-left', 2, 2, top.left],

		['top-middle', 0, 3, top.middle],
		['top-middle', 0, 4, top.middle],
		['top-middle', 0, 5, top.middle],
		['top-middle', 1, 3, top.middle],
		['top-middle', 1, 4, top.middle],
		['top-middle', 1, 5, top.middle],
		['top-middle', 2, 3, top.middle],
		['top-middle', 2, 4, top.middle],
		['top-middle', 2, 5, top.middle],

		['top-right', 0, 6, top.right],
		['top-right', 0, 7, top.right],
		['top-right', 0, 8, top.right],
		['top-right', 1, 6, top.right],
		['top-right', 1, 7, top.right],
		['top-right', 1, 8, top.right],
		['top-right', 2, 6, top.right],
		['top-right', 2, 7, top.right],
		['top-right', 2, 8, top.right],

		['middle-left', 3, 0, middle.left],
		['middle-left', 3, 1, middle.left],
		['middle-left', 3, 2, middle.left],
		['middle-left', 4, 0, middle.left],
		['middle-left', 4, 1, middle.left],
		['middle-left', 4, 2, middle.left],
		['middle-left', 5, 0, middle.left],
		['middle-left', 5, 1, middle.left],
		['middle-left', 5, 2, middle.left],

		['middle-middle', 3, 3, middle.middle],
		['middle-middle', 3, 4, middle.middle],
		['middle-middle', 3, 5, middle.middle],
		['middle-middle', 4, 3, middle.middle],
		['middle-middle', 4, 4, middle.middle],
		['middle-middle', 4, 5, middle.middle],
		['middle-middle', 5, 3, middle.middle],
		['middle-middle', 5, 4, middle.middle],
		['middle-middle', 5, 5, middle.middle],

		['middle-right', 3, 6, middle.right],
		['middle-right', 3, 7, middle.right],
		['middle-right', 3, 8, middle.right],
		['middle-right', 4, 6, middle.right],
		['middle-right', 4, 7, middle.right],
		['middle-right', 4, 8, middle.right],
		['middle-right', 5, 6, middle.right],
		['middle-right', 5, 7, middle.right],
		['middle-right', 5, 8, middle.right],

		['bottom-left', 6, 0, bottom.left],
		['bottom-left', 6, 1, bottom.left],
		['bottom-left', 6, 2, bottom.left],
		['bottom-left', 7, 0, bottom.left],
		['bottom-left', 7, 1, bottom.left],
		['bottom-left', 7, 2, bottom.left],
		['bottom-left', 8, 0, bottom.left],
		['bottom-left', 8, 1, bottom.left],
		['bottom-left', 8, 2, bottom.left],

		['bottom-middle', 6, 3, bottom.middle],
		['bottom-middle', 6, 4, bottom.middle],
		['bottom-middle', 6, 5, bottom.middle],
		['bottom-middle', 7, 3, bottom.middle],
		['bottom-middle', 7, 4, bottom.middle],
		['bottom-middle', 7, 5, bottom.middle],
		['bottom-middle', 8, 3, bottom.middle],
		['bottom-middle', 8, 4, bottom.middle],
		['bottom-middle', 8, 5, bottom.middle],

		['bottom-right', 6, 6, bottom.right],
		['bottom-right', 6, 7, bottom.right],
		['bottom-right', 6, 8, bottom.right],
		['bottom-right', 7, 6, bottom.right],
		['bottom-right', 7, 7, bottom.right],
		['bottom-right', 7, 8, bottom.right],
		['bottom-right', 8, 6, bottom.right],
		['bottom-right', 8, 7, bottom.right],
		['bottom-right', 8, 8, bottom.right],
	])('reads %s subgrid with coordinates (%d, %d)', (_, rowIdx, colIdx, expected) => {
		const result = readGridBoxCellsAt(grid, { colIdx, rowIdx });

		expect(result).to.deep.equal(expected);
	});

	test.each<[row: number, col: number]>([
		[-1, 0],
		[2, 9],
		[-2, 10],
	])('throws when reading with coordinates outside of range', (rowIdx, colIdx) => {
		expect(() => readGridBoxCellsAt(grid, { colIdx, rowIdx })).to.throw(ValueOutOfRangeError);
	});
});

describe(createEmptyGrid.name, () => {
	const grid = createEmptyGrid();
	const emptyCell = createEmptyGridCell();

	test('grid has correct size', () => {
		expect(grid).to.have.lengthOf(GRID_SIZE * GRID_SIZE);
	});

	test.each(grid)('grid has correct values', (cell) => {
		expect(cell).to.equal(emptyCell);
	});
});

describe(createEmptyGridBox.name, () => {
	const grid = createEmptyGridBox();
	const emptyCell = createEmptyGridCell();

	test('grid has correct size', () => {
		expect(grid).to.have.lengthOf(GRID_BOX_SIZE * GRID_BOX_SIZE);
	});

	test.each(grid)('grid has correct values', (cell) => {
		expect(cell).to.deep.equal(emptyCell);
	});
});

describe(fillDiagonalGridBoxesWithValues.name, () => {
	test('fills diagonal subgrids with random digits between 1 and 9', () => {
		expect.assertions(10);

		const grid = createEmptyGrid();

		expect(grid.every(isGridCellEmpty)).to.equal(true);

		fillDiagonalGridBoxesWithValues(grid);

		const topLeftGridBox = readGridBoxCellsAt(grid, { colIdx: 0, rowIdx: 0 });
		const topMiddleGridBox = readGridBoxCellsAt(grid, { colIdx: GRID_BOX_SIZE, rowIdx: 0 });
		const topRightGridBox = readGridBoxCellsAt(grid, { colIdx: GRID_BOX_SIZE * 2, rowIdx: 0 });

		expect(topLeftGridBox.every(isGridCellFilled)).to.equal(true);
		expect(topMiddleGridBox.every(isGridCellEmpty)).to.equal(true);
		expect(topRightGridBox.every(isGridCellEmpty)).to.equal(true);

		const middleLeftGridBox = readGridBoxCellsAt(grid, { colIdx: 0, rowIdx: GRID_BOX_SIZE });
		const middleMiddleGridBox = readGridBoxCellsAt(grid, {
			colIdx: GRID_BOX_SIZE,
			rowIdx: GRID_BOX_SIZE,
		});
		const middleRightGridBox = readGridBoxCellsAt(grid, {
			colIdx: GRID_BOX_SIZE * 2,
			rowIdx: GRID_BOX_SIZE,
		});

		expect(middleLeftGridBox.every(isGridCellEmpty)).to.equal(true);
		expect(middleMiddleGridBox.every(isGridCellFilled)).to.equal(true);
		expect(middleRightGridBox.every(isGridCellEmpty)).to.equal(true);

		const bottomLeftGridBox = readGridBoxCellsAt(grid, { colIdx: 0, rowIdx: GRID_BOX_SIZE * 2 });
		const bottomMiddleGridBox = readGridBoxCellsAt(grid, {
			colIdx: GRID_BOX_SIZE,
			rowIdx: GRID_BOX_SIZE * 2,
		});
		const bottomRightGridBox = readGridBoxCellsAt(grid, {
			colIdx: GRID_BOX_SIZE * 2,
			rowIdx: GRID_BOX_SIZE * 2,
		});

		expect(bottomLeftGridBox.every(isGridCellEmpty)).to.equal(true);
		expect(bottomMiddleGridBox.every(isGridCellEmpty)).to.equal(true);
		expect(bottomRightGridBox.every(isGridCellFilled)).to.equal(true);
	});
});

describe(isGridCellValueCorrectAt.name, () => {
	const _ = createEmptyGridCell();
	const g = [
		[7, 6, 5, _, _, _, _, _, _], // 1st sub-grid is filled correctly
		[3, 9, 1, _, _, _, _, _, _], // 2nd and 3rd are empty, but not inferring with 1st
		[2, 4, 8, _, _, _, _, _, _],
		[1, 2, 6, 8, 4, 3, 5, 9, 4], // 4th sub-grid is filled correctly
		[5, 7, 9, 2, 4, 4, 8, 1, 1], // 5th has duplicated 4 both in it's 2nd column and row
		[4, 8, 3, 5, 1, 9, 7, 6, 2], // 6th has duplicated 1 in it's 2nd row
		[_, _, _, _, _, _, 9, 2, 8], // 9th sub-grid has duplicated 9s
		[_, _, _, _, _, _, 4, 7, 3], // 7th and 8th are empty, but not inferring with 9th
		[_, _, _, _, _, _, 6, 1, 9],
	].flat() as GridFilled;

	// 1st sub-grid
	test.each(
		Array.from({ length: GRID_BOX_CELLS_COUNT }, (_, idx): GridCellCoordinates => {
			return { colIdx: Math.floor(idx / GRID_BOX_SIZE), rowIdx: idx % GRID_BOX_SIZE };
		}),
	)(`no interference, therefore %j is marked as correctly placed`, (coordinates) => {
		expect(isGridCellValueCorrectAt(g, coordinates)).to.equal(true);
	});

	// 1st row of 4th sub-grid
	test.each([
		{ colIdx: 0, rowIdx: 3 },
		{ colIdx: 1, rowIdx: 3 },
		{ colIdx: 2, rowIdx: 3 },
	] satisfies GridCellCoordinates[])(
		`duplicate value in other sub-grid's row, therefore %j marked as incorrectly placed`,
		(coordinates) => {
			expect(isGridCellValueCorrectAt(g, coordinates)).to.equal(false);
		},
	);

	// 3rd row of 4th sub-grid
	test.each([
		{ colIdx: 0, rowIdx: 5 },
		{ colIdx: 1, rowIdx: 5 },
		{ colIdx: 2, rowIdx: 5 },
	] satisfies GridCellCoordinates[])(
		`no interference, therefore (%d, %d) is marked as correctly placed`,
		(coordinates) => {
			expect(isGridCellValueCorrectAt(g, coordinates)).to.equal(true);
		},
	);

	// entire 4th row
	test.each(
		Array.from({ length: GRID_SIZE }, (_, idx): GridCellCoordinates => {
			return { colIdx: idx, rowIdx: 4 };
		}),
	)(`row has duplicated values which makes %j marked as incorrectly placed`, (coordinates) => {
		expect(isGridCellValueCorrectAt(g, coordinates)).to.equal(false);
	});

	// 9th sub-grid
	test.each(
		Array.from({ length: GRID_BOX_CELLS_COUNT }, (_, idx): GridCellCoordinates => {
			return { colIdx: 6 + Math.floor(idx / GRID_BOX_SIZE), rowIdx: 6 + (idx % GRID_BOX_SIZE) };
		}),
	)(`sub-grid has duplicated value which makes %j marked as incorrectly placed`, (coordinates) => {
		expect(isGridCellValueCorrectAt(g, coordinates)).to.equal(false);
	});
});

describe(createEmptyGridCell.name, () => {
	test('creates allowed values accepted by cell', () => {
		expect(createEmptyGridCell()).to.equal(undefined);
	});
});

describe(getAllowedGridCellValuesAt.name, () => {
	const _ = createEmptyGridCell();
	const g = [
		[7, 6, 5, _, _, _, _, 4, _],
		[3, 9, 1, _, _, _, _, _, _],
		[2, 4, 8, _, _, _, _, _, _],
		[_, _, _, 8, 7, 3, _, _, _],
		[_, _, _, 2, 6, 4, _, 9, _],
		[_, _, _, 5, 1, 9, _, _, _],
		[_, _, _, _, _, _, 9, 2, 8],
		[_, _, _, _, _, _, 4, 7, 3],
		[_, _, _, _, _, _, 6, 1, 5],
	].flat() as GridFilled;

	test.each<[GridCellCoordinates, Set<number>]>([
		[{ colIdx: 0, rowIdx: 0 }, new Set()],
		[{ colIdx: 1, rowIdx: 0 }, new Set()],
		[{ colIdx: 7, rowIdx: 2 }, new Set([3, 5, 6])],
	])('returns potentially correct values at given coordinate', (coordinates, expected) => {
		expect(getAllowedGridCellValuesAt(g, coordinates)).to.deep.equal(expected);
	});
});

describe(readGridCellIndexesOfGridBoxAt.name, () => {
	test('returns indexes of entire grid box at given coordinate', () => {
		const left = readGridCellIndexesOfGridBoxAt({ rowIdx: 0, colIdx: 0 });
		const right = new Set([0, 1, 2, 9, 10, 11, 18, 19, 20]);

		expect(left).to.deep.equal(right);
	});
});
