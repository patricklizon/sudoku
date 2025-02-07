import { getRandomInt } from '@/lib/utils/get-random-number';
import {
	IncorrectGridError,
	SUB_GRID_SIZE,
	createEmptyGrid,
	fillDiagonalSubGrids,
	readGridCell,
	fillEmptyGridCells,
} from '@/lib/sudoku/grid';
import type { DifficultyLevelScore, PuzzleSolution, Puzzle } from '@/lib/sudoku/puzzle/types';
import {
	CELL_REMOVING_STRATEGY_BY_DIFFICULTY_LEVEL,
	MINIMUM_GIVEN_CELLS_COUNT_IN_LINE_BY_LEVEL,
	TOTAL_GIVEN_CELLS_RANGE_BY_LEVEL,
} from '@/lib/sudoku/puzzle/difficulty';
import { isNil } from '@/lib/utils/is-nil';

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
	difficulty: DifficultyLevelScore,
): Puzzle {
	const puzzle = structuredClone<Puzzle>(p);
	const totalCellsRange = TOTAL_GIVEN_CELLS_RANGE_BY_LEVEL[difficulty];
	if (isNil(totalCellsRange)) {
		throw new Error(
			`Total given cells range is not defined for difficulty level: ${difficulty.toString()}`,
		);
	}

	const cellRemovingStrateg = CELL_REMOVING_STRATEGY_BY_DIFFICULTY_LEVEL[difficulty];
	if (isNil(cellRemovingStrateg)) {
		throw new Error(
			`Hole punching function is not defined for difficulty level: '${difficulty.toString()}'`,
		);
	}

	const minimumCellsInLineCount = MINIMUM_GIVEN_CELLS_COUNT_IN_LINE_BY_LEVEL[difficulty];
	if (isNil(minimumCellsInLineCount)) {
		throw new Error(
			`Minimum given cells in line count is not defined for difficulty level: ${difficulty.toString()}`,
		);
	}

	const [low, high] = totalCellsRange;
	cellRemovingStrateg(puzzle, {
		minimumGivenCells: {
			col: minimumCellsInLineCount,
			row: minimumCellsInLineCount,
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
