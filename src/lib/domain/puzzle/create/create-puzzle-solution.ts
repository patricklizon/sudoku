import {
	createEmptyGrid,
	fillDiagonalSubGrids,
	fillEmptyGridCells,
	IncorrectGridError,
	SUB_GRID_SIZE,
} from '@/lib/domain/puzzle/grid';
import type { PuzzleSolution } from '@/lib/domain/puzzle/types';

/**
 * Creates a fully solved Sudoku puzzle.
 *
 * @throws {IncorrectGridError} when a valid solution cannot be generated
 */
export function createPuzzleSolution(): PuzzleSolution {
	const grid = createEmptyGrid();

	// Creating start with filling the diagonal sub-grids because these can be filled
	// independently without violating sudoku rules.
	// This initial filling provides anchor points that make the subsequent filling of
	// remaining cells more efficient, as it reduces the number of possible valid combinations
	// for the rest of the grid.
	fillDiagonalSubGrids(grid);

	if (fillEmptyGridCells(grid, SUB_GRID_SIZE)) return grid;

	throw new IncorrectGridError(grid);
}
