/**
 * @module sudoku/puzzle/cell-removing
 * @see https://zhangroup.aporc.org/images/files/Paper_3485.pdf
 *
 * Different approaches to removing cells from PuzzleSolution.
 */

import type { Option } from '@/lib/utils/types/option';
import { shuffleArray } from '@/lib/utils/to-shuffled-array';
import {
	type Grid,
	GRID_CELLS_COUNT,
	GRID_CELLS_INDEXES,
	GRID_SIZE,
	type GridCellCoordinates,
	type GridCellValue,
	isGridCellEmpty,
	isGridCellFilled,
	readAllowedGridCellValuesAtCoordinates,
	readCoordinatesByGridCellIndex,
	readGridCol,
	readGridRow,
} from '../grid';
import { PuzzleGenerationError } from './errors';

export type Config = { minimumGivenCells: { row: number; col: number; total: number } };

/**
 * Mutates passed puzzle.
 */
export type CellRemovingFn = (grid: Grid, config: Config) => void;

/**
 * Mutates passed puzzle.
 */
export const removeCellsRandomly: CellRemovingFn = (g, config) => {
	const idxs = shuffleArray(GRID_CELLS_INDEXES);

	let cellCopy: GridCellValue;
	let stepsCount = idxs.length;
	let coordinates: GridCellCoordinates;

	for (const idx of idxs) {
		coordinates = readCoordinatesByGridCellIndex(idx);
		cellCopy = g[idx];
		g[idx] = undefined;

		if (isRowAndColMinimumCellCountSatisfied(config, g, coordinates) && hasUniqueSolution(g)) {
			stepsCount--;

			if (stepsCount <= config.minimumGivenCells.total) return;
			continue;
		} else {
			g[idx] = cellCopy;
		}
	}

	throw new PuzzleGenerationError(g);
};

/**
 * Mutates passed puzzle.
 *
 * Systematically removes cells by jumping two positions at a time in a zigzag pattern:
 * - Even rows: moves left to right, jumps to next row at the end
 * - Odd rows: moves right to left, jumps to next row at the beginning
 * - Maintains consistent jump distance of 2 cells throughout
 *
 * If target number of empty cells isn't reached after traversing the grid,
 * remaining cells are removed randomly from non empty positions.
 */
export const removeCellsJumpingByOneCell: CellRemovingFn = (g, config) => {
	const oddRowLastIdx = 1;
	const rowLastIdx = GRID_SIZE - 1;
	const jumpByIdx = 2;

	let idx = 0;
	let cellCopy: Option<GridCellValue>;
	let filledCellCount = GRID_CELLS_COUNT;
	let coordinates: Option<GridCellCoordinates>;

	while (filledCellCount > config.minimumGivenCells.total && idx < GRID_CELLS_COUNT) {
		coordinates = readCoordinatesByGridCellIndex(idx);
		cellCopy = g[idx];
		g[idx] = undefined;

		if (isRowAndColMinimumCellCountSatisfied(config, g, coordinates) && hasUniqueSolution(g)) {
			filledCellCount--;
		} else g[idx] = cellCopy;

		if (coordinates.rowIdx % 2) {
			if (coordinates.colIdx === oddRowLastIdx) idx += rowLastIdx;
			else idx -= jumpByIdx;
		} else {
			if (coordinates.colIdx === rowLastIdx) idx += rowLastIdx;
			else idx += jumpByIdx;
		}
	}

	if (filledCellCount <= config.minimumGivenCells.total) return;

	const nonEmptyIdxCollection = shuffleArray(
		g.reduce<number[]>((acc, cell, idx) => {
			if (isGridCellEmpty(cell)) return acc;
			acc.push(idx);
			return acc;
		}, []),
	);

	for (const nonEmptyIdx of nonEmptyIdxCollection) {
		idx = nonEmptyIdx;
		if (filledCellCount <= config.minimumGivenCells.total) return;

		coordinates = readCoordinatesByGridCellIndex(nonEmptyIdx);
		cellCopy = g[idx];
		g[idx] = undefined;

		if (isRowAndColMinimumCellCountSatisfied(config, g, coordinates) && hasUniqueSolution(g)) {
			filledCellCount--;
		} else g[idx] = cellCopy;
	}

	throw new PuzzleGenerationError(g);
};

/**
 * Mutates passed puzzle.
 */
// TODO: implement
export const removeCellsWanderingAlongS: CellRemovingFn = (g, _config) => {
	throw new PuzzleGenerationError(g);
};

/**
 * Mutates passed puzzle.
 */
// TODO: implement
export const removeCellsLeftToRightThenTopToBottom: CellRemovingFn = (g, _config) => {
	throw new PuzzleGenerationError(g);
};

export function isRowAndColMinimumCellCountSatisfied(
	config: Readonly<Config>,
	g: Readonly<Grid>,
	coordinates: Readonly<GridCellCoordinates>,
): boolean {
	return (
		readGridRow(g, coordinates).filter(isGridCellFilled).length >= config.minimumGivenCells.row &&
		readGridCol(g, coordinates).filter(isGridCellFilled).length >= config.minimumGivenCells.col
	);
}

export function hasUniqueSolution(puzzle: Readonly<Grid>): boolean {
	let solutionCount = 0;
	const initialIdx = 0;
	return execute(structuredClone(puzzle), initialIdx);

	function execute(g: Grid, idx: number): boolean {
		if (g.every(isGridCellFilled)) solutionCount++;
		if (solutionCount > 1) return false;

		while (idx < g.length && isGridCellFilled(g[idx])) idx++;
		if (idx >= g.length) return solutionCount === 1;

		for (const val of readAllowedGridCellValuesAtCoordinates(
			g,
			readCoordinatesByGridCellIndex(idx),
		)) {
			g[idx] = val;
			if (!execute(g, idx + 1)) return false;
			g[idx] = undefined;
		}

		return true;
	}
}
