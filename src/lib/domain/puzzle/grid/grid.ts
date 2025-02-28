import { getRandomInt } from '@/lib/utils/get-random-int';
import { isNil } from '@/lib/utils/is-nil';
import type { Range } from '@/lib/utils/types/range';

import { GridHasWrongSizeError, ValueOutOfRangeError } from './errors';
import {
	CELL_ALLOWED_VALUES,
	GRID_CELLS_COUNT,
	GRID_SIZE,
	SUB_GRID_CELLS_COUNT,
	SUB_GRID_SIZE,
} from './constants';
import type {
	ConstructionGrid,
	ConstructionSubGrid,
	Grid,
	GridCellCoordinates,
	GridCellEmptyValue,
	GridCellFilledValue,
	GridCellValue,
	GridCol,
	GridFilled,
	GridRow,
	SubGrid,
} from './types';

import type { Option } from '@/lib/utils/types/option';

/**
 * Mutates passed grid.
 *
 * Fills the diagonal {@link SubGrid} of the given grid with random values.
 * Only fills the diagonal from top-left to bottom-right.
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

export function readAllowedGridCellValuesAt(
	g: Grid | ConstructionGrid,
	coordinates: Readonly<GridCellCoordinates>,
): Set<GridCellFilledValue> {
	return CELL_ALLOWED_VALUES.difference(
		new Set([
			...readSubGridCellsAt(g, coordinates),
			...readGridRowCellsAt(g, coordinates),
			...readGridColAt(g, coordinates),
		]),
	);
}

export function isGridCellValueCorrectAt(
	g: Grid,
	coordinates: Readonly<GridCellCoordinates>,
): boolean {
	const row = readGridRowCellsAt(g, coordinates);
	if (hasDuplicates(row)) return false;

	const col = readGridColAt(g, coordinates);
	if (hasDuplicates(col)) return false;

	const boxValues = readSubGridCellsAt(g, coordinates);
	if (hasDuplicates(boxValues)) return false;

	return true;
}

export function hasDuplicates(cells: readonly GridCellValue[]): boolean {
	const values = cells.filter(isGridCellFilled);
	return new Set(values).size !== values.length;
}

export function readGridColAt(
	g: Readonly<Grid | ConstructionGrid>,
	coordinates: Readonly<GridCellCoordinates>,
): GridCol {
	const result = [];
	for (let idx = coordinates.colIdx; idx < GRID_CELLS_COUNT; idx += GRID_SIZE) result.push(g[idx]);
	return result as GridCol;
}

export function readColCellIndexesAt(coordinates: Readonly<GridCellCoordinates>): Set<number> {
	const result = new Set<number>();
	for (let idx = 0; idx < GRID_CELLS_COUNT; idx += GRID_SIZE) result.add(coordinates.colIdx + idx);
	return result;
}

export function readGridRowCellsAt(
	g: Readonly<Grid | ConstructionGrid>,
	coordinates: Readonly<GridCellCoordinates>,
): GridRow {
	return g.slice(coordinates.rowIdx * GRID_SIZE, (coordinates.rowIdx + 1) * GRID_SIZE) as GridRow;
}

export function readRowCellIndexesAt(coordinates: Readonly<GridCellCoordinates>): Set<number> {
	const result = new Set<number>();
	for (let idx = 0; idx < GRID_SIZE; idx++) result.add(coordinates.rowIdx * GRID_SIZE + idx);
	return result;
}

export function readGridCell(
	g: Readonly<Grid | GridFilled>,
	coordinates: Readonly<GridCellCoordinates>,
): Readonly<Option<number>> {
	assertCoordinateIsWithinRange(coordinates.rowIdx);
	assertCoordinateIsWithinRange(coordinates.colIdx);

	return g[coordinates.rowIdx * GRID_SIZE + coordinates.colIdx];
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

export function readSubGridCellsAt(
	g: Readonly<Grid>,
	coordinates: Readonly<GridCellCoordinates>,
): SubGrid;
export function readSubGridCellsAt(
	g: Readonly<ConstructionGrid>,
	coordinates: Readonly<GridCellCoordinates>,
): ConstructionSubGrid;
export function readSubGridCellsAt(g: unknown, coordinates: GridCellCoordinates): Array<unknown> {
	assertCoordinateIsWithinRange(coordinates.rowIdx);
	assertCoordinateIsWithinRange(coordinates.colIdx);

	const subGridStartRowIdx = Math.floor(coordinates.rowIdx / SUB_GRID_SIZE) * SUB_GRID_SIZE;
	const subGridStartColIdx = Math.floor(coordinates.colIdx / SUB_GRID_SIZE) * SUB_GRID_SIZE;

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

export function readCellIndexesOfSubGridAt(
	coordinates: Readonly<GridCellCoordinates>,
): Set<number> {
	assertCoordinateIsWithinRange(coordinates.rowIdx);
	assertCoordinateIsWithinRange(coordinates.colIdx);

	const result = new Set<number>();
	const subGridStartRowIdx = Math.floor(coordinates.rowIdx / SUB_GRID_SIZE) * SUB_GRID_SIZE;
	const subGridStartColIdx = Math.floor(coordinates.colIdx / SUB_GRID_SIZE) * SUB_GRID_SIZE;

	let gridIdx: number;
	for (let rIdx = 0; rIdx < SUB_GRID_SIZE; rIdx++) {
		for (let cIdx = 0; cIdx < SUB_GRID_SIZE; cIdx++) {
			gridIdx = (subGridStartRowIdx + rIdx) * GRID_SIZE + (subGridStartColIdx + cIdx);
			result.add(gridIdx);
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

export function createEmptyCell(): GridCellEmptyValue {
	return undefined;
}

/**
 * Creates an empty Sudoku grid.
 *
 * @throws {GridHasWrongSizeError} when created grid length does not match required size.
 */
export function createEmptyGrid(): Grid {
	const result = Array.from({ length: GRID_CELLS_COUNT }, createEmptyCell) as Grid;
	if (GRID_SIZE ** 2 !== result.length) {
		throw new GridHasWrongSizeError(result);
	}

	return result;
}

export function createEmptySubGrid(): SubGrid | ConstructionSubGrid {
	return Array.from({ length: SUB_GRID_CELLS_COUNT }, createEmptyCell) as SubGrid;
}

export function isGridCellEmpty(it: unknown): it is GridCellEmptyValue {
	return isNil(it);
}

export function isGridCellFilled(it: GridCellValue): it is GridCellFilledValue {
	if (isNil(it)) return false;
	return CELL_ALLOWED_VALUES.has(it);
}

/**
 * @throws {ValueOutOfRangeError} when number is out of allowed range.
 */
export function assertGridIndexIsWithinRange(idx: number): void {
	const range = [0, GRID_CELLS_COUNT - 1] satisfies Range<number>;
	if (idx < range[0] || range[1] < idx) {
		throw new ValueOutOfRangeError(range, idx);
	}
}

export function mapGridIndexToCoordinates(idx: number): GridCellCoordinates {
	assertGridIndexIsWithinRange(idx);

	return {
		rowIdx: Math.floor(idx / GRID_SIZE),
		colIdx: idx % GRID_SIZE,
	};
}

export function mapGridIndexToRowIndex(idx: number): number {
	assertGridIndexIsWithinRange(idx);

	return Math.floor(idx / GRID_SIZE);
}

export function mapGridIndexToColIndex(idx: number): number {
	assertGridIndexIsWithinRange(idx);

	return Math.floor(idx % GRID_SIZE);
}

export function mapGridToConstructionGrid(g: Grid): ConstructionGrid {
	return g.map((it, idx) => {
		return isGridCellFilled(it)
			? it
			: readAllowedGridCellValuesAt(g, mapGridIndexToCoordinates(idx));
	});
}
