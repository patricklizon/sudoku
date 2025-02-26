/**
 * @module sudoku/puzzle/cell-removing
 * @see https://zhangroup.aporc.org/images/files/Paper_3485.pdf
 *
 * Different approaches to removing cells from PuzzleSolution.
 */

import type { Option } from '@/lib/utils/types/option';
import { shuffleArray, toShuffledArray } from '@/lib/utils/to-shuffled-array';
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
} from '@/lib/domain/puzzle/grid';
import { PuzzleGenerationError } from '@/lib/domain/puzzle/create/errors';
import type { Range } from '@/lib/utils/types/range';
import type { DeepReadonly } from '@/lib/utils/types/deep-readonly';

export type Config = DeepReadonly<{
	minimumGivenCells: {
		row: number;
		col: number;
		total: { count: number; range: Range<number> };
	};
}>;

export type CellRemovingFn = (grid: Readonly<Grid>, config: Config) => Grid;

/**
 * Removes cells in random order.
 */
export const removeCellsRandomly: CellRemovingFn = (g, config) => {
	assertConfigCorrectness(config);

	const gCopy = structuredClone<Grid>(g);
	const idxs = toShuffledArray(GRID_CELLS_INDEXES);
	const targetEmptyCellCount = GRID_CELLS_INDEXES.length - config.minimumGivenCells.total.count;

	let cellCopy: GridCellValue;
	let coordinates: GridCellCoordinates;
	let removedCellCount = 0;

	for (const idx of idxs) {
		coordinates = readCoordinatesByGridCellIndex(idx);
		cellCopy = gCopy[idx];
		gCopy[idx] = undefined;

		if (
			isRowAndColMinimumCellCountSatisfied(config, gCopy, coordinates) &&
			hasUniqueSolution(gCopy)
		) {
			removedCellCount++;

			if (removedCellCount >= targetEmptyCellCount) return gCopy;
			continue;
		} else {
			gCopy[idx] = cellCopy;
		}
	}

	if (isRemovedCellCountWithinConstrains(config, removedCellCount)) return gCopy;

	throw new PuzzleGenerationError(gCopy);
};

/**
 * Systematically removes cells by jumping two positions at a time in a zigzag pattern:
 * - Even rows: moves left to right, jumps to next row at the end
 * - Odd rows: moves right to left, jumps to next row at the beginning
 * - Maintains consistent jump distance of 2 cells throughout
 *
 * If target number of empty cells isn't reached after traversing the grid,
 * remaining cells are removed randomly from non empty positions.
 */
export const removeCellsJumpingByOneCell: CellRemovingFn = (g, config) => {
	assertConfigCorrectness(config);

	const gCopy = structuredClone<Grid>(g);
	const targetEmptyCellCount = GRID_CELLS_COUNT - config.minimumGivenCells.total.count;
	const oddRowLastIdx = 1;
	const rowLastIdx = GRID_SIZE - 1;
	const jumpByIdx = 2;

	let idx = 0;
	let cellCopy: Option<GridCellValue>;
	let removedCellCount = 0;
	let coordinates: Option<GridCellCoordinates>;

	while (removedCellCount < targetEmptyCellCount && idx < GRID_CELLS_COUNT) {
		coordinates = readCoordinatesByGridCellIndex(idx);
		cellCopy = gCopy[idx];
		gCopy[idx] = undefined;

		if (
			isRowAndColMinimumCellCountSatisfied(config, gCopy, coordinates) &&
			hasUniqueSolution(gCopy)
		) {
			removedCellCount++;
		} else gCopy[idx] = cellCopy;

		if (coordinates.rowIdx % 2) {
			if (coordinates.colIdx === oddRowLastIdx) idx += rowLastIdx;
			else idx -= jumpByIdx;
		} else {
			if (coordinates.colIdx === rowLastIdx) idx += rowLastIdx;
			else idx += jumpByIdx;
		}
	}

	if (removedCellCount >= targetEmptyCellCount) return gCopy;

	const nonEmptyIdxCollection = shuffleArray(
		gCopy.reduce<number[]>((acc, cell, idx) => {
			if (isGridCellEmpty(cell)) return acc;
			acc.push(idx);
			return acc;
		}, []),
	);

	for (const nonEmptyIdx of nonEmptyIdxCollection) {
		idx = nonEmptyIdx;
		if (removedCellCount >= targetEmptyCellCount) return gCopy;

		coordinates = readCoordinatesByGridCellIndex(nonEmptyIdx);
		cellCopy = gCopy[idx];
		gCopy[idx] = undefined;

		if (
			isRowAndColMinimumCellCountSatisfied(config, gCopy, coordinates) &&
			hasUniqueSolution(gCopy)
		) {
			removedCellCount++;
		} else gCopy[idx] = cellCopy;
	}

	if (isRemovedCellCountWithinConstrains(config, removedCellCount)) return gCopy;

	throw new PuzzleGenerationError(gCopy);
};

// TODO: implement
export const removeCellsWanderingAlongS: CellRemovingFn = (g, _config) => {
	// const gCopy = structuredClone<Grid>(g);
	//
	// if (isRemovedCellCountWithinConstrains(config, removedCellCount)) return g;

	throw new PuzzleGenerationError(g);
};

// TODO: implement
export const removeCellsLeftToRightThenTopToBottom: CellRemovingFn = (g, _config) => {
	// const gCopy = structuredClone<Grid>(g);
	//
	// if (isRemovedCellCountWithinConstrains(config, removedCellCount)) return g;

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

export function assertConfigCorrectness(config: Config): void {
	if (
		config.minimumGivenCells.total.count <
		GRID_SIZE * Math.max(config.minimumGivenCells.row, config.minimumGivenCells.col)
	) {
		throw new Error("Configuraion's constrains cold not be satisfied");
	}
}

export function isRemovedCellCountWithinConstrains(config: Config, count: number): boolean {
	if (count < config.minimumGivenCells.total.count) return false;

	const [min, max] = config.minimumGivenCells.total.range;
	return min <= count && count <= max;
}
