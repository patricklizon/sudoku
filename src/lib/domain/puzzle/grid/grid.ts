import { isNil } from '@/lib/utils/is-nil';
import type { Range } from '@/lib/utils/types/range';

import { GridHasWrongSizeError, ValueOutOfRangeError } from './errors';
import {
	GRID_CELL_ALLOWED_VALUES,
	GRID_CELL_COUNT,
	GRID_SIZE,
	GRID_BOX_CELLS_COUNT,
	GRID_BOX_SIZE,
} from './constants';
import type {
	Grid,
	GridCellCoordinates,
	GridCellEmpty,
	GridCellFilled,
	GridCell,
	GridColumn,
	GridFilled,
	GridRow,
	GridBox,
	GridCellEmptyWithPossibleValues,
	GridWithPossibleValues,
} from './types';

import type { Option } from '@/lib/utils/types/option';
import { shuffleArray } from '@/lib/utils/to-shuffled-array';

/**
 * Mutates passed grid.
 *
 * Fills the diagonal {@link GridBox} of the given grid with random values.
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

export function fillDiagonalGridBoxesWithValues(g: Grid): void {
	const allowedArr = [...GRID_CELL_ALLOWED_VALUES];

	let allowedValues: number[];
	let gridCellIdxs: number[];
	for (let cIdx = 0; cIdx < GRID_SIZE; cIdx += GRID_BOX_SIZE) {
		allowedValues = shuffleArray(allowedArr);
		gridCellIdxs = [...readGridCellIndexesOfGridBoxAt({ rowIdx: cIdx, colIdx: cIdx })];

		for (let idx = 0; idx < allowedValues.length; idx++) {
			g[gridCellIdxs[idx] as unknown as number] = allowedValues[idx];
		}
	}
}

export function getAllowedGridCellValuesAt(
	g: Readonly<Grid | GridWithPossibleValues>,
	coordinates: Readonly<GridCellCoordinates>,
): Set<GridCellFilled> {
	return GRID_CELL_ALLOWED_VALUES.difference(
		new Set([
			...readGridBoxCellsAt(g, coordinates),
			...readGridRowCellsAt(g, coordinates),
			...readGridColumnAt(g, coordinates),
		]),
	);
}

export function isGridCellValueCorrectAt(
	g: Readonly<Grid>,
	coordinates: Readonly<GridCellCoordinates>,
): boolean {
	const row = readGridRowCellsAt(g, coordinates);
	if (hasDuplicates(row)) return false;

	const col = readGridColumnAt(g, coordinates);
	if (hasDuplicates(col)) return false;

	const boxValues = readGridBoxCellsAt(g, coordinates);
	if (hasDuplicates(boxValues)) return false;

	return true;
}

export function hasDuplicates(
	cells: readonly (GridCell | GridCellEmptyWithPossibleValues)[],
): boolean {
	const values = cells.filter(isGridCellFilled);
	return new Set(values).size !== values.length;
}

export function readGridColumnAt(
	g: Readonly<Grid | GridWithPossibleValues>,
	coordinates: Readonly<GridCellCoordinates>,
): GridColumn {
	const result = [];
	for (let idx = coordinates.colIdx; idx < GRID_CELL_COUNT; idx += GRID_SIZE) result.push(g[idx]);
	return result as GridColumn;
}

export function readGridColumnCellIndexesAt(
	coordinates: Readonly<GridCellCoordinates>,
): Set<number> {
	const result = new Set<number>();
	for (let idx = 0; idx < GRID_CELL_COUNT; idx += GRID_SIZE) result.add(coordinates.colIdx + idx);
	return result;
}

export function readGridRowCellsAt(
	g: Readonly<Grid | GridWithPossibleValues>,
	coordinates: Readonly<GridCellCoordinates>,
): GridRow {
	return g.slice(coordinates.rowIdx * GRID_SIZE, (coordinates.rowIdx + 1) * GRID_SIZE) as GridRow;
}

export function readGridRowCellIndexesAt(coordinates: Readonly<GridCellCoordinates>): Set<number> {
	const result = new Set<number>();
	for (let idx = 0; idx < GRID_SIZE; idx++) result.add(coordinates.rowIdx * GRID_SIZE + idx);
	return result;
}

export function readGridCellAt(
	g: Readonly<Grid | GridFilled>,
	coordinates: Readonly<GridCellCoordinates>,
): Readonly<Option<number>> {
	assertGridCellCoordinateIsWithinRange(coordinates.rowIdx);
	assertGridCellCoordinateIsWithinRange(coordinates.colIdx);

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

export function readGridBoxCellsAt(
	g: Readonly<Grid | GridWithPossibleValues>,
	coordinates: Readonly<GridCellCoordinates>,
): GridBox<GridCell | GridCellEmptyWithPossibleValues> {
	assertGridCellCoordinateIsWithinRange(coordinates.rowIdx);
	assertGridCellCoordinateIsWithinRange(coordinates.colIdx);

	const gridBoxStartRowIdx = Math.floor(coordinates.rowIdx / GRID_BOX_SIZE) * GRID_BOX_SIZE;
	const gridBoxStartColIdx = Math.floor(coordinates.colIdx / GRID_BOX_SIZE) * GRID_BOX_SIZE;

	const result = createEmptyGridBox();
	let resultIdx = 0;

	for (let rIdx = 0; rIdx < GRID_BOX_SIZE; rIdx++) {
		for (let cIdx = 0; cIdx < GRID_BOX_SIZE; cIdx++) {
			const gridIdx = (gridBoxStartRowIdx + rIdx) * GRID_SIZE + (gridBoxStartColIdx + cIdx);
			result[resultIdx++] = g[gridIdx];
		}
	}

	return result;
}

export function readGridCellIndexesOfGridBoxAt(
	coordinates: Readonly<GridCellCoordinates>,
): Set<number> {
	assertGridCellCoordinateIsWithinRange(coordinates.rowIdx);
	assertGridCellCoordinateIsWithinRange(coordinates.colIdx);

	const result = new Set<number>();
	const gridBoxStartRowIdx = Math.floor(coordinates.rowIdx / GRID_BOX_SIZE) * GRID_BOX_SIZE;
	const gridBoxStartColIdx = Math.floor(coordinates.colIdx / GRID_BOX_SIZE) * GRID_BOX_SIZE;

	let gridIdx: number;
	for (let rIdx = 0; rIdx < GRID_BOX_SIZE; rIdx++) {
		for (let cIdx = 0; cIdx < GRID_BOX_SIZE; cIdx++) {
			gridIdx = (gridBoxStartRowIdx + rIdx) * GRID_SIZE + (gridBoxStartColIdx + cIdx);
			result.add(gridIdx);
		}
	}

	return result;
}

/**
 * @throws {ValueOutOfRangeError} when number is out of allowed range.
 */
export function assertGridCellCoordinateIsWithinRange(it: number): void {
	const range: [start: number, end: number] = [0, GRID_SIZE - 1];
	if (range[0] <= it && it <= range[1]) return;
	throw new ValueOutOfRangeError(range, it);
}

export function createEmptyGridCell(): GridCellEmpty {
	return undefined;
}

/**
 * Creates an empty Sudoku grid.
 *
 * @throws {GridHasWrongSizeError} when created grid length does not match required size.
 */
export function createEmptyGrid(): Grid {
	const result = Array.from({ length: GRID_CELL_COUNT }, createEmptyGridCell) as Grid;
	if (GRID_SIZE ** 2 !== result.length) {
		throw new GridHasWrongSizeError(result);
	}

	return result;
}

export function createEmptyGridBox(): GridBox<GridCell | GridCellEmptyWithPossibleValues> {
	return Array.from({ length: GRID_BOX_CELLS_COUNT }, createEmptyGridCell) as GridBox;
}

export function isGridCellEmpty(it: unknown): it is GridCellEmpty {
	return isNil(it);
}

export function isGridCellFilled(
	it: GridCell | GridCellEmptyWithPossibleValues,
): it is GridCellFilled {
	if (isNil(it) || it instanceof Set) return false;
	return GRID_CELL_ALLOWED_VALUES.has(it);
}

/**
 * @throws {ValueOutOfRangeError} when number is out of allowed range.
 */
export function assertGridCellIndexIsWithinRange(idx: number): void {
	const range = [0, GRID_CELL_COUNT - 1] satisfies Range<number>;
	if (idx < range[0] || range[1] < idx) {
		throw new ValueOutOfRangeError(range, idx);
	}
}

export function mapGridCellIndexToCoordinates(idx: number): GridCellCoordinates {
	assertGridCellIndexIsWithinRange(idx);

	return {
		rowIdx: Math.floor(idx / GRID_SIZE),
		colIdx: idx % GRID_SIZE,
	};
}

export function mapGridCellIndexToRowIndex(idx: number): number {
	assertGridCellIndexIsWithinRange(idx);

	return Math.floor(idx / GRID_SIZE);
}

export function mapGridCellIndexToColIndex(idx: number): number {
	assertGridCellIndexIsWithinRange(idx);

	return Math.floor(idx % GRID_SIZE);
}

export function mapGridToGridWithPossibleValues(g: Readonly<Grid>): GridWithPossibleValues {
	return g.map((it, idx) => {
		return isGridCellFilled(it)
			? it
			: getAllowedGridCellValuesAt(g, mapGridCellIndexToCoordinates(idx));
	}) as GridWithPossibleValues;
}
