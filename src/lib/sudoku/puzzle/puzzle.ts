import {
	IncorrectGridError,
	SUB_GRID_SIZE,
	createEmptyGrid,
	fillDiagonalSubGrids,
	fillEmptyGridCells,
	readCell,
} from '@/lib/sudoku/grid';
import type { PuzzleSolvable, PuzzleSolved } from './types';

/**
 * Creates a fully solved Sudoku puzzle.
 *
 * The function first fills the diagonal sub-grids because these can be filled
 * independently without violating Sudoku rules. This initial filling provides
 * anchor points that make the subsequent filling of remaining cells more efficient,
 * as it reduces the number of possible valid combinations for the rest of the grid.
 *
 * @throws {IncorrectGridError} when a valid solution cannot be generated
 */
export function createSolvedPuzzle(): PuzzleSolved {
	const grid = createEmptyGrid();

	fillDiagonalSubGrids(grid);

	// starting filling from 1st element of 2nd subgrid as diagonal values were fixed
	if (fillEmptyGridCells(grid, 0, SUB_GRID_SIZE)) return grid;

	throw new IncorrectGridError(grid);
}

export function createSolvablePuzzle(
	p: PuzzleSolved,
	difficulty: 'easy' | 'normal' | 'hard' | 'expert',
): PuzzleSolvable {
	return;
}

export function isValueValid(
	p: PuzzleSolved,
	rowIdx: number,
	colIdx: number,
	value: number,
): boolean {
	return readCell(p, rowIdx, colIdx) === value;
}
