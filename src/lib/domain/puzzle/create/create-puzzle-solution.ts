import {
	createEmptyGrid,
	fillDiagonalSubGrids,
	fillEmptyGridCells,
	type GridFilled,
	IncorrectGridError,
	SUB_GRID_SIZE,
} from '@/lib/domain/puzzle/grid';

/**
 * Creates a fully solved Sudoku puzzle.
 *
 * @throws {IncorrectGridError} when a valid solution cannot be generated
 */
export function createPuzzleSolution(): GridFilled {
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
