import { getRandomInt } from '@/lib/utils/get-random-number';
import {
	IncorrectGridError,
	SUB_GRID_SIZE,
	createEmptyGrid,
	fillDiagonalSubGrids,
	readGridCell,
	fillEmptyGridCells,
} from '../grid';
import type { PuzzleDifficultyLevel, PuzzleSolution, Puzzle } from './types';
import {
	holePunchingStrategyByDifficultyLevel,
	LOWER_BOUND_OF_GIVEN_CELLS_IN_ROW_AND_COLUMN_BY_DIFFICULTY_LEVEL,
	TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL,
} from './difficulty';

/**
 * Creates a fully solved Sudoku puzzle.
 *
 * @throws {IncorrectGridError} when a valid solution cannot be generated
 */
export function createPuzzleSolution(): Readonly<PuzzleSolution> {
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

/**
 * Creates unsolved sudoku puzzle with unique solution.
 */
export function createPuzzle(
	p: Readonly<PuzzleSolution>,
	difficulty: PuzzleDifficultyLevel,
): Puzzle {
	const puzzle = structuredClone<Puzzle>(p);
	const [low, high] = TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[difficulty];

	holePunchingStrategyByDifficultyLevel[difficulty](puzzle, {
		minimumGivenCells: {
			col: LOWER_BOUND_OF_GIVEN_CELLS_IN_ROW_AND_COLUMN_BY_DIFFICULTY_LEVEL[difficulty],
			row: LOWER_BOUND_OF_GIVEN_CELLS_IN_ROW_AND_COLUMN_BY_DIFFICULTY_LEVEL[difficulty],
			total: low + getRandomInt(high - low),
		},
	});
	return puzzle;
}

export function isValueValid(
	p: PuzzleSolution,
	rowIdx: number,
	colIdx: number,
	value: number,
): boolean {
	return readGridCell(p, rowIdx, colIdx) === value;
}
