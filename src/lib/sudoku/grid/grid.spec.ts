import { isNil } from '@/lib/utils/is-nil';
import { describe, expect, test } from 'vitest';
import { GRID_SIZE, SUB_GRID_SIZE } from './constants';
import { ValueOutOfRangeError } from './errors';
import {
	assertIsCoordinateWithinRange,
	createEmptyGrid,
	createEmptySubGrid,
	fillDiagonalSubGrids,
	fillEmptyGridCells,
	readSubGridCells,
} from './grid';
import type { Grid, GridFilled, GridRow } from './types';

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
		const result = readSubGridCells(grid, rowIdx, colIdx);
		expect(result).to.deep.equal(expected);
	});

	test.each<[row: number, col: number]>([
		[-1, 0],
		[2, 9],
		[-2, 10],
	])('throws when reading with coordinates outside of range', (rowIdx, colIdx) => {
		expect(() => readSubGridCells(grid, rowIdx, colIdx)).to.throw(ValueOutOfRangeError);
	});
});

describe(createEmptyGrid.name, () => {
	const grid = createEmptyGrid();

	test('grid has correct size', () => {
		expect(grid).to.have.lengthOf(GRID_SIZE * GRID_SIZE);
	});

	test('grid has correct values', () => {
		expect(grid.every(isNil)).to.equal(true);
	});
});

describe(createEmptySubGrid.name, () => {
	const grid = createEmptySubGrid();

	test('grid has correct size', () => {
		expect(grid).to.have.lengthOf(SUB_GRID_SIZE * SUB_GRID_SIZE);
	});

	test('grid has correct values', () => {
		expect(grid.every(isNil)).to.equal(true);
	});
});

describe(fillDiagonalSubGrids.name, () => {
	test('fills diagonal subgrids with random digits between 1 and 9', () => {
		const grid = createEmptyGrid();

		expect(grid.every(isNil)).to.equal(true);

		fillDiagonalSubGrids(grid);

		const topLeftSubGrid = readSubGridCells(grid, 0, 0);

		const middleSubGrid = readSubGridCells(
			grid,
			Math.floor(GRID_SIZE / 2),
			Math.floor(GRID_SIZE / 2),
		);
		const bottomRightSubGrid = readSubGridCells(grid, GRID_SIZE - 1, GRID_SIZE - 1);

		expect(topLeftSubGrid.every(Number.isInteger)).to.equal(true);
		expect(middleSubGrid.every(Number.isInteger)).to.equal(true);
		expect(bottomRightSubGrid.every(Number.isInteger)).to.equal(true);
		expect(grid.some(isNil)).to.equal(true);
	});
});

describe(fillEmptyGridCells.name, () => {
	test('fills only empty fields of grid', () => {
		const left = [
			[7, 6, 5, undefined, undefined, undefined, undefined, undefined, undefined],
			[3, 9, 1, undefined, undefined, undefined, undefined, undefined, undefined],
			[2, 4, 8, undefined, undefined, undefined, undefined, undefined, undefined],
			[undefined, undefined, undefined, 8, 7, 3, undefined, undefined, undefined],
			[undefined, undefined, undefined, 2, 6, 4, undefined, undefined, undefined],
			[undefined, undefined, undefined, 5, 1, 9, undefined, undefined, undefined],
			[undefined, undefined, undefined, undefined, undefined, undefined, 9, 2, 8],
			[undefined, undefined, undefined, undefined, undefined, undefined, 4, 7, 3],
			[undefined, undefined, undefined, undefined, undefined, undefined, 6, 1, 5],
		].flat() as Grid;

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

		fillEmptyGridCells(left, 0, 0);

		expect(left).to.deep.equal(right);
	});
});

describe(assertIsCoordinateWithinRange.name, () => {
	test.each<number>([-Infinity, -2, -1, 9, 11, Infinity])('throws when out of range', (value) => {
		expect(() => {
			assertIsCoordinateWithinRange(value);
		}).to.throw(ValueOutOfRangeError);
	});

	test.each<number>([0, 1, 2, 3, 4, 5, 6, 7, 8])('does nothing when within range', (value) => {
		expect(() => {
			assertIsCoordinateWithinRange(value);
		}).not.to.throw(ValueOutOfRangeError);
	});
});
