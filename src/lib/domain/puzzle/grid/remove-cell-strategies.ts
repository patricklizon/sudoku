/**
 * @module sudoku/puzzle/cell-removing
 * @see https://zhangroup.aporc.org/images/files/Paper_3485.pdf
 *
 * Different ways of removing cells from {@link PuzzleSolution}.
 */

import type { Option } from '@/lib/utils/types/option';
import { shuffleArray, toShuffledArray } from '@/lib/utils/to-shuffled-array';
import {
	type Grid,
	GRID_CELL_COUNT,
	GRID_CELL_INDEXES,
	GRID_SIZE,
	type GridCellCoordinates,
	type GridCell,
	type GridFilled,
	hasUniqueSolution,
	isGridCellEmpty,
	isGridCellFilled,
	mapGridIndexToCoordinates,
	readGridColumnAt,
	readGridRowCellsAt,
	mapGridCellIndexToRowIndex,
	mapGridCellIndexToColIndex,
	GRID_BOX_CELLS_INDEXES,
} from '@/lib/domain/puzzle/grid';
import { PuzzleGenerationError } from '@/lib/domain/puzzle/errors';
import type { PuzzleDifficultyLevel } from '@/lib/domain/puzzle/types';
import type { Range } from '@/lib/utils/types/range';
import type { DeepReadonly } from '@/lib/utils/types/deep-readonly';
import { TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL } from '@/lib/domain/puzzle/difficulty';
import { isNil } from '@/lib/utils/is-nil';
import { isEven } from '@/lib/utils/is-even';

export type Config = DeepReadonly<{
	minimumGivenCells: {
		row: number;
		col: number;
		total: { count: number; range: Range<number> };
	};
	difficulty: PuzzleDifficultyLevel;
}>;

export type GridCellRemovingFn = (grid: Readonly<GridFilled>, config: Config) => Grid;

/**
 * Removes cells in random order.
 */
export const removeGridCellsRandomly: GridCellRemovingFn = (g, config) => {
	_assertConfigCorrectness(config);

	const gCopy = structuredClone<Grid>(g);
	const idxs = toShuffledArray(GRID_CELL_INDEXES);
	const targetEmptyCellCount = GRID_CELL_COUNT - config.minimumGivenCells.total.count;

	let cellCopy: GridCell;
	let coordinates: GridCellCoordinates;
	let removedCellCount = 0;

	for (const idx of idxs) {
		coordinates = mapGridIndexToCoordinates(idx);
		cellCopy = gCopy[idx];
		gCopy[idx] = undefined;

		if (
			_isRowAndColMinimumCellCountSatisfied(config, gCopy, coordinates) &&
			hasUniqueSolution(gCopy)
		) {
			removedCellCount++;

			if (removedCellCount >= targetEmptyCellCount) return gCopy;
		} else {
			gCopy[idx] = cellCopy;
		}
	}

	// TODO: wrap loop with while
	if (_isRemovedCellCountWithinRequestedConstrains(config, removedCellCount)) return gCopy;
	if (_isRemovedCellCountWithinGlobalConstrains(config, removedCellCount)) return gCopy;

	throw new PuzzleGenerationError(g, config, removedCellCount);
};

/**
 * Systematically removes cells by jumping two positions at a time in a zigzag pattern:
 * - Even rows: moves left to right, jumps to next row at the end
 * - Odd rows: moves right to left, jumps to next row at the beginning
 * - Maintains consistent jump distance of 2 cells throughout
 *
 * If target number of empty cells isn't reached after traversing the grid,
 * remaining cells are removed randomly from non empty positions.
 *
 * @example
 * ```txt
 * Pattern:
 * | _, 1, _, 9, _, _, _, 7, _ |
 * | 7, _, 5, _, 6, _, 8, _, 1 |
 * | _, 3, _, 5, _, 1, _, _, _ |
 * | 2, _, 1, _, 3, _, _, _, 7 |
 * | _, 8, _, _, _, 2, _, 5, _ |
 * | 9, _, 4, _, 1, _, 2, _, _ |
 * | _, 2, _, 1, _, _, _, 6, _ |
 * | _, _, _, 7, 2, _, 3, _, 5 |
 * | _, 7, _, _, 8, 4, _, 1, _ |
 * ```
 */
export const removeGridCellsJumpingByOneCell: GridCellRemovingFn = (g, config) => {
	_assertConfigCorrectness(config);

	const gCopy = structuredClone<Grid>(g);
	const targetEmptyCellCount = GRID_CELL_COUNT - config.minimumGivenCells.total.count;
	const oddRowLastIdx = 1;
	const rowLastIdx = GRID_SIZE - 1;
	const jumpByIdx = 2;

	let idx = 0;
	let cellCopy: Option<GridCell>;
	let removedCellCount = 0;
	let coordinates: Option<GridCellCoordinates>;

	while (removedCellCount < targetEmptyCellCount && idx < GRID_CELL_COUNT) {
		coordinates = mapGridIndexToCoordinates(idx);
		cellCopy = gCopy[idx];
		gCopy[idx] = undefined;

		if (
			_isRowAndColMinimumCellCountSatisfied(config, gCopy, coordinates) &&
			hasUniqueSolution(gCopy)
		) {
			removedCellCount++;
		} else {
			gCopy[idx] = cellCopy;
		}

		if (isEven(coordinates.rowIdx)) {
			if (coordinates.colIdx === rowLastIdx) idx += rowLastIdx;
			else idx += jumpByIdx;
		} else {
			if (coordinates.colIdx === oddRowLastIdx) idx += rowLastIdx;
			else idx -= jumpByIdx;
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

		coordinates = mapGridIndexToCoordinates(nonEmptyIdx);
		cellCopy = gCopy[idx];
		gCopy[idx] = undefined;

		if (
			_isRowAndColMinimumCellCountSatisfied(config, gCopy, coordinates) &&
			hasUniqueSolution(gCopy)
		) {
			removedCellCount++;
		} else {
			gCopy[idx] = cellCopy;
		}
	}
	// TODO: refactor to backtracking
	if (_isRemovedCellCountWithinRequestedConstrains(config, removedCellCount)) return gCopy;
	if (_isRemovedCellCountWithinGlobalConstrains(config, removedCellCount)) return gCopy;

	throw new PuzzleGenerationError(g, config, removedCellCount);
};

/**
 * Removes cells by traversing even rows from left to right, and odd rows from right to left.
 *
 * @example
 * ```txt
 * Pattern:
 * |_, _, _, _, _, _, _, 6, 9|
 * |3, 5, _, _, _, _, _, _, _|
 * |_, _, _, _, _, _, 4, _, 3|
 * |1, 2, _, _, _, _, _, _, _|
 * |_, _, _, _, _, _, _, 8, 1|
 * |_, _, 6, 1, _, 3, 2, _, _|
 * |_, 6, 5, _, _, 1, _, _, 8|
 * |_, 9, _, 2, 8, _, _, 7, _|
 * |_, _, 2, _, 7, 5, 9, 4, 6|
 * ````
 */
export const removeGridCellsWanderingAlongS: GridCellRemovingFn = (g, config) => {
	_assertConfigCorrectness(config);

	const gCopy = structuredClone<Grid>(g);
	const targetEmptyCellCount = GRID_CELL_COUNT - config.minimumGivenCells.total.count;

	let idx = 0;
	let cellCopy: Option<GridCell>;
	let removedCellCount = 0;
	let coordinates: Option<GridCellCoordinates>;
	let rowIdx = mapGridCellIndexToRowIndex(idx);
	let colIdx = mapGridCellIndexToColIndex(idx);

	while (removedCellCount < targetEmptyCellCount && idx < GRID_CELL_COUNT) {
		coordinates = mapGridIndexToCoordinates(idx);
		cellCopy = gCopy[idx];
		gCopy[idx] = undefined;

		if (
			_isRowAndColMinimumCellCountSatisfied(config, gCopy, coordinates) &&
			hasUniqueSolution(gCopy)
		) {
			removedCellCount++;
		} else {
			gCopy[idx] = cellCopy;
		}

		rowIdx = mapGridCellIndexToRowIndex(idx);
		colIdx = mapGridCellIndexToColIndex(idx);

		if (isEven(rowIdx)) {
			if (colIdx === GRID_BOX_CELLS_INDEXES.at(-1)) idx += 9;
			else idx++;
		} else {
			if (colIdx === GRID_BOX_CELLS_INDEXES.at(0)) idx += 9;
			else idx--;
		}
	}

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

		coordinates = mapGridIndexToCoordinates(nonEmptyIdx);
		cellCopy = gCopy[idx];
		gCopy[idx] = undefined;

		if (
			_isRowAndColMinimumCellCountSatisfied(config, gCopy, coordinates) &&
			hasUniqueSolution(gCopy)
		) {
			removedCellCount++;
		} else {
			gCopy[idx] = cellCopy;
		}
	}

	if (removedCellCount >= targetEmptyCellCount) return gCopy;
	// TODO: refactor to backtracking
	if (_isRemovedCellCountWithinRequestedConstrains(config, removedCellCount)) return gCopy;
	if (_isRemovedCellCountWithinGlobalConstrains(config, removedCellCount)) return gCopy;

	throw new PuzzleGenerationError(g, config, 0);
};

// TODO: implement
export const removeGridCellsLeftToRightThenTopToBottom: GridCellRemovingFn = (g, _config) => {
	// const gCopy = structuredClone<Grid>(g);
	//
	// if (isRemovedCellCountWithinConstrains(config, removedCellCount)) return g;

	throw new PuzzleGenerationError(g, _config, 0);
};

/**
 * @private
 */
export function _isRowAndColMinimumCellCountSatisfied(
	config: Readonly<Config>,
	g: Readonly<Grid>,
	coordinates: Readonly<GridCellCoordinates>,
): boolean {
	return (
		readGridRowCellsAt(g, coordinates).filter(isGridCellFilled).length >=
			config.minimumGivenCells.row &&
		readGridColumnAt(g, coordinates).filter(isGridCellFilled).length >= config.minimumGivenCells.col
	);
}

/**
 * @private
 */
export function _assertConfigCorrectness(config: Config): void {
	if (
		config.minimumGivenCells.total.count <
		GRID_SIZE * Math.max(config.minimumGivenCells.row, config.minimumGivenCells.col)
	) {
		// TODO: implement error
		throw new Error("Configuraion's constrains cold not be satisfied");
	}
}

/**
 * @private
 */
export function _isRemovedCellCountWithinRequestedConstrains(
	config: Config,
	removedCount: number,
): boolean {
	const rc = _countRemainingGridCells(removedCount);
	if (rc < config.minimumGivenCells.total.count) return false;

	const [min, max] = config.minimumGivenCells.total.range;
	return min <= rc && rc <= max;
}

/**
 * @private
 */
export function _isRemovedCellCountWithinGlobalConstrains(
	config: Config,
	removedCount: number,
): boolean {
	const rc = _countRemainingGridCells(removedCount);
	if (rc < config.minimumGivenCells.total.count) return false;

	const globalRange =
		TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[config.difficulty as PuzzleDifficultyLevel];
	// TODO: implement error
	if (isNil(globalRange)) throw new Error('collapse');
	return globalRange[0] <= rc && rc <= globalRange[1];
}

function _countRemainingGridCells(removed: number): number {
	return GRID_CELL_COUNT - removed;
}
