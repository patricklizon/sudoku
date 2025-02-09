import type { Range } from '@/lib/types/range';
import { isNil } from '@/lib/utils/is-nil';
import { isDefined } from '@/lib/utils/is-defined';
import { IncorrectGridError, ValueOutOfRangeError } from './errors';
import {
	CELL_ALLOWED_VALUES,
	GRID_CELLS_COUNT,
	GRID_SIZE,
	SUB_GRID_CELLS_COUNT,
	SUB_GRID_SIZE,
} from './constants';
import type {
	Grid,
	GridCol,
	GridCell,
	GridFilled,
	GridRow,
	SubGrid,
	GridCellEmpty,
	GridCellFilled,
	GridCellCoordinates,
} from './types';
import { getRandomInt } from '@/lib/utils/get-random-int';

/**
 * Mutatest passed grid.
 *
 * Recursively fills entire grid.
 */
export function fillEmptyGridCells(g: Grid, idx: number): g is GridFilled {
	if (g.every(isGridCellFilled)) return true;

	const cellCopy = g[idx];
	const nextIdx = idx + 1;
	if (isGridCellFilled(cellCopy)) return fillEmptyGridCells(g, nextIdx);

	const coordinates = readCoordinatesByGridCellIndex(idx);
	for (const v of readAllowedGridCellValuesAtCoordinates(g, coordinates)) {
		g[idx] = v;
		if (fillEmptyGridCells(g, nextIdx)) return true;
	}

	g[idx] = cellCopy;
	return false;
}

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
function getRandomDigit(): number {
	return getRandomInt(GRID_SIZE) + 1;
}

export function readAllowedGridCellValuesAtCoordinates(
	g: Grid,
	c: GridCellCoordinates,
): Set<GridCellFilled> {
	const forbidden = new Set<number>();
	const placed = new Set(readGridRow(g, c).concat(readGridCol(g, c), readSubGridCells(g, c)));

	for (const value of placed) {
		if (isNil(value) || forbidden.has(value)) continue;
		forbidden.add(value);
	}

	return CELL_ALLOWED_VALUES.difference(forbidden);
}

export function isGridCellValueCorrectAtCoordinates(g: Grid, c: GridCellCoordinates): boolean {
	const row = readGridRow(g, c);
	if (hasDuplicates(row)) return false;

	const col = readGridCol(g, c);
	if (hasDuplicates(col)) return false;

	const boxValues = readSubGridCells(g, c);
	if (hasDuplicates(boxValues)) return false;

	return true;
}

export function hasDuplicates(cells: readonly GridCell[]): boolean {
	const values = cells.filter(isGridCellFilled);
	return new Set(values).size !== values.length;
}

export function readGridCol(g: Readonly<Grid>, { colIdx }: Readonly<GridCellCoordinates>): GridCol {
	const result = [];
	for (let idx = colIdx; idx < GRID_CELLS_COUNT; idx += GRID_SIZE) result.push(g[idx]);
	return result as GridCol;
}

export function readGridRow(g: Readonly<Grid>, { rowIdx }: Readonly<GridCellCoordinates>): GridRow {
	return g.slice(rowIdx * GRID_SIZE, (rowIdx + 1) * GRID_SIZE) as GridRow;
}

export function readCoordinatesByGridCellIndex(idx: number): GridCellCoordinates {
	if (idx < 0 || GRID_CELLS_COUNT < idx) {
		throw new ValueOutOfRangeError([0, GRID_CELLS_COUNT], idx);
	}

	return {
		rowIdx: Math.floor(idx / GRID_SIZE),
		colIdx: idx % GRID_SIZE,
	};
}

export function readGridCell<G extends Grid | GridFilled>(
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
export function readSubGridCells(g: Readonly<Grid>, c: GridCellCoordinates): SubGrid {
	assertCoordinateIsWithinRange(c.rowIdx);
	assertCoordinateIsWithinRange(c.colIdx);

	const subGridStartRowIdx = Math.floor(c.rowIdx / SUB_GRID_SIZE) * SUB_GRID_SIZE;
	const subGridStartColIdx = Math.floor(c.colIdx / SUB_GRID_SIZE) * SUB_GRID_SIZE;

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
 * @throws {ValueOutOfRangeError} when number is out of allowed range.
 */
export function assertCoordinateIsWithinRange(it: number): void {
	const range: [start: number, end: number] = [0, GRID_SIZE - 1];
	if (range[0] <= it && it <= range[1]) return;
	throw new ValueOutOfRangeError(range, it);
}

export function createEmptyCell(): GridCellEmpty {
	return undefined;
}

/**
 * Creates an empty Sudoku grid.
 *
 * @throws {IncorrectGridError} when created grid length does not match required size.
 */
export function createEmptyGrid(): Grid {
	const result = Array.from({ length: GRID_CELLS_COUNT }, createEmptyCell) as Grid;
	if (GRID_SIZE ** 2 !== result.length) {
		throw new IncorrectGridError(result);
	}

	return result;
}

export function createEmptySubGrid(): SubGrid {
	return Array.from({ length: SUB_GRID_CELLS_COUNT }, createEmptyCell) as SubGrid;
}

export function isGridCellEmpty(it: GridCell): it is GridCellEmpty {
	return isNil(it);
}

export function isGridCellFilled(it: GridCell): it is GridCellFilled {
	return isDefined(it) && CELL_ALLOWED_VALUES.has(it);
}

/**
 * @throws {ValueOutOfRangeError} when number is out of allowed range.
 */
export function assertIndexIsWithinRange(idx: number) {
	const range = [0, GRID_CELLS_COUNT - 1] satisfies Range<number>;
	if (idx < range[0] || range[1] < idx) {
		throw new ValueOutOfRangeError(range, idx);
	}
}

export function indexToCoordinates(idx: number): GridCellCoordinates {
	assertIndexIsWithinRange(idx);

	return {
		rowIdx: Math.floor(idx / GRID_SIZE),
		colIdx: idx % GRID_SIZE,
	};
}
