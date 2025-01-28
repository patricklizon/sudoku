import { describe, expect, test } from 'vitest';
import {
	CELL_ALLOWED_VALUES,
	GRID_CELLS_COUNT,
	GRID_SIZE,
	SUB_GRID_CELLS_COUNT,
	SUB_GRID_SIZE,
} from './constants';
import { ValueOutOfRangeError } from './errors';
import {
	assertCoordinateIsWithinRange,
	assertIndexIsWithinRange,
	createEmptyGrid,
	createEmptySubGrid,
	fillDiagonalSubGrids,
	readSubGridCells,
	isGridCellValueCorrectAtCoordinates,
	createEmptyCell,
	isGridCellEmpty,
	isGridCellFilled,
	indexToCoordinates,
	readAllowedGridCellCellValuesAtCoordinates,
	fillEmptyGridCells,
} from './grid';
import type { Grid, GridCellCoordinates, GridFilled, GridRow } from './types';

describe(isGridCellEmpty.name, () => {
	test('returns true when cell is empty', () => {
		expect(isGridCellEmpty(undefined)).to.equal(true);
	});

	test('returns false when cell has value', () => {
		expect(isGridCellEmpty(2)).to.equal(false);
	});
});

describe(isGridCellFilled.name, () => {
	test.each(Array.from(CELL_ALLOWED_VALUES))(
		'returns true when cell has allowed value',
		(value) => {
			expect(isGridCellFilled(value)).to.equal(true);
		},
	);

	test('returns false when cell does not have value', () => {
		expect(isGridCellFilled(undefined)).to.equal(false);
	});

	test.each([-1, 10])('returns false when cell has illegal value', (value) => {
		expect(isGridCellFilled(value)).to.equal(false);
	});
});

describe(fillEmptyGridCells.name, () => {
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

		fillEmptyGridCells(left, 0);

		expect(left).to.deep.equal(right);
	});
});

describe(readSubGridCells.name, () => {
	type TestData = Record<'middle' | 'left' | 'right', GridRow>;

	const top = {
		middle: [221, 222, 223, 224, 225, 226, 227, 228, 229],
		left: [111, 112, 113, 121, 122, 123, 131, 132, 133],
		right: [331, 332, 333, 341, 342, 343, 351, 352, 353],
	} satisfies TestData;

	const middle = {
		middle: [511, 512, 513, 521, 522, 523, 531, 532, 533],
		left: [411, 412, 413, 421, 422, 423, 431, 432, 433],
		right: [611, 612, 613, 621, 622, 623, 631, 632, 633],
	} satisfies TestData;

	const bottom = {
		middle: [811, 812, 813, 821, 822, 823, 831, 832, 833],
		left: [711, 712, 713, 721, 722, 723, 731, 732, 733],
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
		const result = readSubGridCells(grid, { rowIdx, colIdx });

		expect(result).to.deep.equal(expected);
	});

	test.each<[row: number, col: number]>([
		[-1, 0],
		[2, 9],
		[-2, 10],
	])('throws when reading with coordinates outside of range', (rowIdx, colIdx) => {
		expect(() => readSubGridCells(grid, { rowIdx, colIdx })).to.throw(ValueOutOfRangeError);
	});
});

describe(createEmptyGrid.name, () => {
	const grid = createEmptyGrid();

	test('grid has correct size', () => {
		expect(grid).to.have.lengthOf(GRID_SIZE * GRID_SIZE);
	});

	test('grid has correct values', () => {
		const emptyCell = createEmptyCell();
		grid.forEach((cell) => {
			expect(cell).to.equal(emptyCell);
		});
	});
});

describe(createEmptySubGrid.name, () => {
	const grid = createEmptySubGrid();
	const emptyCell = createEmptyCell();

	test('grid has correct size', () => {
		expect(grid).to.have.lengthOf(SUB_GRID_SIZE * SUB_GRID_SIZE);
	});

	test('grid has correct values', () => {
		grid.forEach((cell) => {
			expect(cell).to.deep.equal(emptyCell);
		});
	});
});

describe(fillDiagonalSubGrids.name, () => {
	test('fills diagonal subgrids with random digits between 1 and 9', () => {
		expect.assertions(10);

		const grid = createEmptyGrid();

		expect(grid.every(isGridCellEmpty)).to.equal(true);

		fillDiagonalSubGrids(grid);

		const topLeftSubGrid = readSubGridCells(grid, { rowIdx: 0, colIdx: 0 });
		const topMiddleSubGrid = readSubGridCells(grid, { rowIdx: 0, colIdx: SUB_GRID_SIZE });
		const topRightSubGrid = readSubGridCells(grid, { rowIdx: 0, colIdx: SUB_GRID_SIZE * 2 });

		expect(topLeftSubGrid.every(isGridCellFilled)).to.equal(true);
		expect(topMiddleSubGrid.every(isGridCellEmpty)).to.equal(true);
		expect(topRightSubGrid.every(isGridCellEmpty)).to.equal(true);

		const middleLeftSubGrid = readSubGridCells(grid, { rowIdx: SUB_GRID_SIZE, colIdx: 0 });
		const middleMiddleSubGrid = readSubGridCells(grid, {
			rowIdx: SUB_GRID_SIZE,
			colIdx: SUB_GRID_SIZE,
		});
		const middleRightSubGrid = readSubGridCells(grid, {
			rowIdx: SUB_GRID_SIZE,
			colIdx: SUB_GRID_SIZE * 2,
		});

		expect(middleLeftSubGrid.every(isGridCellEmpty)).to.equal(true);
		expect(middleMiddleSubGrid.every(isGridCellFilled)).to.equal(true);
		expect(middleRightSubGrid.every(isGridCellEmpty)).to.equal(true);

		const bottomLeftSubGrid = readSubGridCells(grid, { rowIdx: SUB_GRID_SIZE * 2, colIdx: 0 });
		const bottomMiddleSubGrid = readSubGridCells(grid, {
			rowIdx: SUB_GRID_SIZE * 2,
			colIdx: SUB_GRID_SIZE,
		});
		const bottomRightSubGrid = readSubGridCells(grid, {
			rowIdx: SUB_GRID_SIZE * 2,
			colIdx: SUB_GRID_SIZE * 2,
		});

		expect(bottomLeftSubGrid.every(isGridCellEmpty)).to.equal(true);
		expect(bottomMiddleSubGrid.every(isGridCellEmpty)).to.equal(true);
		expect(bottomRightSubGrid.every(isGridCellFilled)).to.equal(true);
	});
});

describe.each([])(assertCoordinateIsWithinRange.name, () => {
	test.each<number>([-Infinity, -2, -1, 9, 11, Infinity])('throws when out of range', (value) => {
		expect(() => {
			assertCoordinateIsWithinRange(value);
		}).to.throw(ValueOutOfRangeError);
	});

	test.each<number>(Array.from({ length: GRID_SIZE }, (_, idx) => idx))(
		'does nothing when within range',
		(value) => {
			expect(() => {
				assertCoordinateIsWithinRange(value);
			}).not.to.throw(ValueOutOfRangeError);
		},
	);
});

describe(assertIndexIsWithinRange.name, () => {
	test.each<number>([-Infinity, -2, -1, GRID_CELLS_COUNT, Infinity])(
		'throws when out of range',
		(value) => {
			expect(() => {
				assertIndexIsWithinRange(value);
			}).to.throw(ValueOutOfRangeError);
		},
	);

	test.each<number>(Array.from({ length: GRID_CELLS_COUNT }, (_, idx) => idx))(
		'does nothing when within range',
		(value) => {
			expect(() => {
				assertIndexIsWithinRange(value);
			}).not.to.throw(ValueOutOfRangeError);
		},
	);
});

describe(isGridCellValueCorrectAtCoordinates.name, () => {
	const _ = createEmptyCell();
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
		Array.from({ length: SUB_GRID_CELLS_COUNT }, (_, idx): GridCellCoordinates => {
			return { rowIdx: idx % SUB_GRID_SIZE, colIdx: Math.floor(idx / SUB_GRID_SIZE) };
		}),
	)(`no interference, therefore %j is marked as correctly placed`, (coordinates) => {
		expect(isGridCellValueCorrectAtCoordinates(g, coordinates)).to.equal(true);
	});

	// 1st row of 4th sub-grid
	test.each([
		{ rowIdx: 3, colIdx: 0 },
		{ rowIdx: 3, colIdx: 1 },
		{ rowIdx: 3, colIdx: 2 },
	] satisfies GridCellCoordinates[])(
		`duplicate value in other sub-grid's row, therefore %j marked as incorrectly placed`,
		(coordinates) => {
			expect(isGridCellValueCorrectAtCoordinates(g, coordinates)).to.equal(false);
		},
	);

	// 3rd row of 4th sub-grid
	test.each([
		{ rowIdx: 5, colIdx: 0 },
		{ rowIdx: 5, colIdx: 1 },
		{ rowIdx: 5, colIdx: 2 },
	] satisfies GridCellCoordinates[])(
		`no interference, therefore (%d, %d) is marked as correctly placed`,
		(coordinates) => {
			expect(isGridCellValueCorrectAtCoordinates(g, coordinates)).to.equal(true);
		},
	);

	// entire 4th row
	test.each(
		Array.from({ length: GRID_SIZE }, (_, idx): GridCellCoordinates => {
			return { rowIdx: 4, colIdx: idx };
		}),
	)(`row has duplicated values which makes %j marked as incorrectly placed`, (coordinates) => {
		expect(isGridCellValueCorrectAtCoordinates(g, coordinates)).to.equal(false);
	});

	// 9th sub-grid
	test.each(
		Array.from({ length: SUB_GRID_CELLS_COUNT }, (_, idx): GridCellCoordinates => {
			return { rowIdx: 6 + (idx % SUB_GRID_SIZE), colIdx: 6 + Math.floor(idx / SUB_GRID_SIZE) };
		}),
	)(`sub-grid has duplicated value which makes %j marked as incorrectly placed`, (coordinates) => {
		expect(isGridCellValueCorrectAtCoordinates(g, coordinates)).to.equal(false);
	});
});

describe(createEmptyCell.name, () => {
	test('creates allowed values accepted by cell', () => {
		expect(createEmptyCell()).to.equal(undefined);
	});
});

describe(indexToCoordinates.name, () => {
	test.each([-1, GRID_CELLS_COUNT])('throws when index is out of range', (idx) => {
		expect(() => indexToCoordinates(idx)).to.throw(ValueOutOfRangeError);
	});

	test.each<[idx: number, coordinates: GridCellCoordinates]>([
		[0, { colIdx: 0, rowIdx: 0 }],
		[1, { colIdx: 1, rowIdx: 0 }],
		[4 * GRID_SIZE + 3, { colIdx: 3, rowIdx: 4 }],
	])('translate index (%d) to grid coordinate %j', (idx, coordinates) => {
		expect(indexToCoordinates(idx)).and.to.deep.equal(coordinates);
	});
});

describe(readAllowedGridCellCellValuesAtCoordinates.name, () => {
	const _ = createEmptyCell();
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
		[{ rowIdx: 0, colIdx: 0 }, new Set()],
		[{ rowIdx: 0, colIdx: 1 }, new Set()],
		[{ rowIdx: 2, colIdx: 7 }, new Set([3, 5, 6])],
	])('returns potentially correct values at given coordinate', (coordinates, expected) => {
		expect(readAllowedGridCellCellValuesAtCoordinates(g, coordinates)).to.deep.equal(expected);
	});
});
