/**
 * @module sudoku/puzzle/hole-punching
 * @see https://zhangroup.aporc.org/images/files/Paper_3485.pdf
 *
 * Different approaches to removing cells from PuzzleSolution.
 */

import type { Option } from '@/lib/types/option';
import { toShuffledArray } from '@/lib/utils/to-shuffled-array';
import {
	GRID_CELLS_COUNT,
	type GridCell,
	type GridCellCoordinates,
	readCoordinateByGridCellIndex,
	readGridRow,
	isGridCellFilled,
	readGridCol,
} from '../grid';
import type { Puzzle } from './types';

/**
 * Mutates passed puzzle.
 */
export type CellRemovingFn = (
	puzzle: Puzzle,
	config: { minimumGivenCells: { row: number; col: number; total: number } },
) => void;

export const removeCellsRandomly: CellRemovingFn = (puzzle, config) => {
	const idxs = toShuffledArray(Array.from({ length: GRID_CELLS_COUNT }, (_, idx) => idx));

	let cellCopy: GridCell;
	let stepsCount = idxs.length;
	let coordinates: Option<GridCellCoordinates>;

	for (const idx of idxs) {
		coordinates = readCoordinateByGridCellIndex(idx);
		cellCopy = puzzle[idx];
		puzzle[idx] = undefined;

		if (
			readGridRow(puzzle, coordinates).filter(isGridCellFilled).length >=
				config.minimumGivenCells.row &&
			readGridCol(puzzle, coordinates).filter(isGridCellFilled).length >=
				config.minimumGivenCells.col
			// TODO: implement check for unique solution
			// hasUniqueSolution(puzzle)
		) {
			stepsCount--;
			puzzle[idx] = undefined;

			if (stepsCount <= config.minimumGivenCells.total) return;
			else continue;
		} else {
			puzzle[idx] = cellCopy;
		}
	}
};

export const removeCellsJumpingByOneCell: CellRemovingFn = (puzzle, config) => {};

export const removeCellsWanderingAlongS: CellRemovingFn = (puzzle, config) => {};

export const removeCellsLeftToRightThenTopToBottom: CellRemovingFn = (puzzle, config) => {};
