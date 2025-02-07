/**
 * @module sudoku/puzzle/cell-removing
 * @see https://zhangroup.aporc.org/images/files/Paper_3485.pdf
 *
 * Different approaches to removing cells from PuzzleSolution.
 */

import type { Option } from '@/lib/types/option';
import { toShuffledArray } from '@/lib/utils/to-shuffled-array';
import {
	GRID_CELLS_COUNT,
	isGridCellFilled,
	readAllowedGridCellCellValuesAtCoordinates,
	readCoordinateByGridCellIndex,
	readGridCol,
	readGridRow,
	type GridCell,
	type GridCellCoordinates,
} from '@/lib/sudoku/grid';
import type { Puzzle } from '@/lib/sudoku/puzzle/types';

type Config = { minimumGivenCells: { row: number; col: number; total: number } };

/**
 * Mutates passed puzzle.
 */
export type CellRemovingFn = (puzzle: Puzzle, config: Config) => void;

/**
 * Mutates passed puzzle.
 */
export const removeCellsRandomly: CellRemovingFn = (puzzle, config) => {
	const idxs = toShuffledArray(Array.from({ length: GRID_CELLS_COUNT }, (_, idx) => idx));

	let cellCopy: GridCell;
	let stepsCount = idxs.length;
	let coordinates: Option<GridCellCoordinates>;

	for (const idx of idxs) {
		coordinates = readCoordinateByGridCellIndex(idx);
		cellCopy = puzzle[idx];
		puzzle[idx] = undefined;

		if (isPuzzleValid(config, puzzle, coordinates)) {
			stepsCount--;
			puzzle[idx] = undefined;

			if (stepsCount <= config.minimumGivenCells.total) return;
			else continue;
		} else {
			puzzle[idx] = cellCopy;
		}
	}
};

/**
 * Mutates passed puzzle.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const removeCellsJumpingByOneCell: CellRemovingFn = (puzzle, config) => {};

/**
 * Mutates passed puzzle.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const removeCellsWanderingAlongS: CellRemovingFn = (puzzle, config) => {};

/**
 * Mutates passed puzzle.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const removeCellsLeftToRightThenTopToBottom: CellRemovingFn = (puzzle, config) => {};

export function isPuzzleValid(
	config: Readonly<Config>,
	puzzle: Readonly<Puzzle>,
	coordinates: Readonly<GridCellCoordinates>,
): boolean {
	return (
		readGridRow(puzzle, coordinates).filter(isGridCellFilled).length >=
			config.minimumGivenCells.row &&
		readGridCol(puzzle, coordinates).filter(isGridCellFilled).length >=
			config.minimumGivenCells.col &&
		hasUniqueSolution(puzzle)
	);
}

export function hasUniqueSolution(puzzle: Readonly<Puzzle>): boolean {
	return execute(structuredClone(puzzle));

	function execute(p: Puzzle, idx = 0, solutionCount = 0): boolean {
		if (p.every(isGridCellFilled)) solutionCount++;
		if (solutionCount > 1) return false;

		while (idx < p.length && isGridCellFilled(p[idx])) idx++;
		if (idx >= p.length) return solutionCount === 1;

		for (const val of readAllowedGridCellCellValuesAtCoordinates(
			p,
			readCoordinateByGridCellIndex(idx),
		)) {
			p[idx] = val;
			if (!execute(p, idx + 1)) return false;
			p[idx] = undefined;
		}

		return true;
	}
}
