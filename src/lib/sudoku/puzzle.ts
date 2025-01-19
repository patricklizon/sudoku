import { SUB_GRID_SIZE } from './constants';
import { IncorrectGridError } from './errors';
import { _createEmptyGrid, fillDiagonalSubGrids, fillEmptyGridFields } from './grid';
import type { PuzzleSolvable, PuzzleSolved } from './types';

export function createSolvedPuzzle(): PuzzleSolved {
	const grid = _createEmptyGrid();

	fillDiagonalSubGrids(grid);

	if (fillEmptyGridFields(grid, 0, SUB_GRID_SIZE)) return grid;

	throw new IncorrectGridError(grid);
}

export function createSolvablePuzzle(
	p: PuzzleSolved,
	difficulty: 'easy' | 'normal' | 'hard',
): PuzzleSolvable {
	return g;
}

export function isValueValid(
	p: PuzzleSolved,
	rowIdx: number,
	colIdx: number,
	value: number,
): boolean {}
