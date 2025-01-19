import { SUB_GRID_SIZE } from './constants';
import { IncorrectGridError } from './errors';
import { createEmptyGrid, fillDiagonalSubGrids, fillEmptyGridCells, readCell } from './grid';
import type { PuzzleSolvable, PuzzleSolved } from './types';

export function createSolvedPuzzle(): PuzzleSolved {
	const grid = createEmptyGrid();

	fillDiagonalSubGrids(grid);

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
