import { isDefined } from '@/lib/utils/is-defined';
import { IncorrectGridError, ValueOutOfRangeError } from './errors';
import { GRID_CELLS_COUNT, GRID_SIZE, SUB_GRID_CELLS_COUNT, SUB_GRID_SIZE } from './constants';
import type { Grid, GridCol, GridCell, GridFilled, GridRow, SubGrid } from './types';

/**
 * Fills the diagonal sub-grids (3x3 blocks) of the given grid with random digits 1-9.
 * Only fills the diagonal blocks from top-left to bottom-right.
 *
 * @example
 * ```txt
 * Filled sub grids:
 * |D, _, _|
 * |_, D, _|
 * |_, _, D|
 *````
 */
export function fillDiagonalSubGrids(g: Grid): void {
	const usedDigits = new Set<number>();
	let nextDigit = getRandomDigit();

	for (let subGridStartIdx = 0; subGridStartIdx < GRID_SIZE; subGridStartIdx += SUB_GRID_SIZE) {
		usedDigits.clear();

		for (let rowIdx = 0; rowIdx < SUB_GRID_SIZE; rowIdx++) {
			for (let colIdx = 0; colIdx < SUB_GRID_SIZE; colIdx++) {
				while (usedDigits.has(nextDigit)) nextDigit = getRandomDigit();
				usedDigits.add(nextDigit);
				g[subGridStartIdx * GRID_SIZE + rowIdx * GRID_SIZE + colIdx + subGridStartIdx] = nextDigit;
			}
		}
	}
}

/**
 * Returns digit within valid range.
 */
export function getRandomDigit(): number {
	return Math.floor(Math.random() * GRID_SIZE) + 1;
}

/**
 * Recursively fills empty cells in a Sudoku grid.
 * Attempts to fill each empty cell with a valid number that satisfies Sudoku rules.
 * Uses backtracking - if a number doesn't work, tries the next number or backtracks to previous cells.
 *
 * @returns Type predicate indicating if grid was successfully filled
 *
 */
export function fillEmptyGridCells(g: Grid, rowIdx: number, colIdx: number): g is GridFilled {
	if (rowIdx >= GRID_SIZE) return true;

	const cellIdx = rowIdx * GRID_SIZE + colIdx;
	const nextRowIdx = colIdx === GRID_SIZE - 1 ? rowIdx + 1 : rowIdx;
	const nextColIdx = (colIdx + 1) % GRID_SIZE;

	if (g[cellIdx]) {
		return fillEmptyGridCells(g, nextRowIdx, nextColIdx);
	}

	for (let num = 1; num <= GRID_SIZE; num++) {
		g[cellIdx] = num;

		if (isValueCorrectForCellAtPosition(g, rowIdx, colIdx)) {
			if (fillEmptyGridCells(g, nextRowIdx, nextColIdx)) return true;
		}
	}

	g[cellIdx] = undefined;

	return false;
}

export function isValueCorrectForCellAtPosition(g: Grid, rowIdx: number, colIdx: number): boolean {
	const row = readRow(g, rowIdx);
	if (hasDuplicates(row)) return false;

	const col = readCol(g, colIdx);
	if (hasDuplicates(col)) return false;

	const boxValues = readSubGridCells(g, rowIdx, colIdx);
	if (hasDuplicates(boxValues)) return false;

	return true;
}

export function hasDuplicates(c: Readonly<GridCell[]>): boolean {
	const numbers = c.filter(isDefined);
	const set = new Set(numbers);
	return set.size !== numbers.length;
}

function readCol(g: Grid, colIdx: number): GridCol {
	const result = [];
	for (let idx = colIdx; idx < GRID_CELLS_COUNT; idx += GRID_SIZE) result.push(g[idx]);
	return result as GridCol;
}

function readRow(g: Grid, rowIdx: number): GridRow {
	return g.slice(rowIdx * GRID_SIZE, (rowIdx + 1) * GRID_SIZE) as GridRow;
}

export function readCell<G extends Grid | GridFilled>(
	g: G,
	rowIdx: number,
	colIdx: number,
): G[number] {
	return g[rowIdx * GRID_SIZE + colIdx];
}

/**
 * Reads all values from a sub-grid containing the specified coordinates.
 *
 * A sub-grid is one of nine 3x3 sections in the Sudoku grid. This function
 * determines which sub-grid contains the given coordinates and returns all
 * values from that sub-grid in row-major order.
 *
 * @throws {ValueOutOfRangeError} when coordinates are outside valid range.
 *
 * @example
 * ```txt
 * Example for coordinates (1,5) // -> cell with value 9
 *
 * |_, _, _|4, 5, 6|_, _, _|
 * |_, _, _|7, 8, 9|_, _, _|
 * |_, _, _|1, 2, 3|_, _, _|
 *
 * Returns: [4, 5, 6, 7, 8, 9, 1, 2, 3]
 * ```
 */
export function readSubGridCells(g: Readonly<Grid>, rowIdx: number, colIdx: number): SubGrid {
	assertIsCoordinateWithinRange(rowIdx);
	assertIsCoordinateWithinRange(colIdx);

	const subGridStartRowIdx = Math.floor(rowIdx / SUB_GRID_SIZE) * SUB_GRID_SIZE;
	const subGridStartColIdx = Math.floor(colIdx / SUB_GRID_SIZE) * SUB_GRID_SIZE;

	const result = createEmptySubGrid();
	let resultIdx = 0;

	for (let rIdx = 0; rIdx < SUB_GRID_SIZE; rIdx++) {
		for (let cIdx = 0; cIdx < SUB_GRID_SIZE; cIdx++) {
			const gridIdx = (subGridStartRowIdx + rIdx) * GRID_SIZE + (subGridStartColIdx + cIdx);
			result[resultIdx++] = g[gridIdx];
		}
	}

	return result;
}

/**
 * @throw {ValueOutOfRangeError} when number is out of allowed range.
 */
export function assertIsCoordinateWithinRange(it: number): void {
	const range: [number, number] = [0, GRID_SIZE - 1];
	if (range[0] <= it && it <= range[1]) return;
	throw new ValueOutOfRangeError(range, it);
}

/**
 * Creates an empty Sudoku grid.
 *
 * @throws {IncorrectGridError} when created grid length does not match required size.
 */
export function createEmptyGrid(): Grid {
	const result = Array.from({ length: GRID_CELLS_COUNT }, () => undefined) as Grid;
	if (GRID_SIZE ** 2 !== result.length) {
		throw new IncorrectGridError(result);
	}

	return result;
}

export function createEmptySubGrid(): SubGrid {
	return Array.from({ length: SUB_GRID_CELLS_COUNT }, () => undefined) as SubGrid;
}
