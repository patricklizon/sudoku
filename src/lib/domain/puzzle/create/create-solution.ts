import { getRandomInt } from '@/lib/utils/get-random-int';
import {
	DIFFICULTY_LEVEL,
	MINIMUM_GIVEN_CELLS_COUNT_IN_LINE_BY_DIFFICULTY_LEVEL,
	type PuzzleDifficultyLevelScore,
	TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL,
} from '@/lib/domain/puzzle-difficulty';
import { isNil } from '@/lib/utils/is-nil';
import {
	createEmptyGrid,
	fillDiagonalSubGrids,
	fillEmptyGridCells,
	type Grid,
	type GridCellCoordinates,
	type GridFilled,
	IncorrectGridError,
	readGridCell,
	SUB_GRID_SIZE,
} from '../grid';
import {
	type CellRemovingFn,
	removeCellsJumpingByOneCell,
	removeCellsLeftToRightThenTopToBottom,
	removeCellsRandomly,
	removeCellsWanderingAlongS,
} from './remove-cell-strategies';

const CELL_REMOVING_STRATEGY_BY_DIFFICULTY_LEVEL: Record<
	PuzzleDifficultyLevelScore,
	CellRemovingFn
> = {
	[DIFFICULTY_LEVEL[1]]: removeCellsRandomly,
	[DIFFICULTY_LEVEL[2]]: removeCellsRandomly,
	[DIFFICULTY_LEVEL[3]]: removeCellsJumpingByOneCell,
	[DIFFICULTY_LEVEL[4]]: removeCellsWanderingAlongS,
	[DIFFICULTY_LEVEL[5]]: removeCellsLeftToRightThenTopToBottom,
};

/**
 * Creates a fully solved Sudoku puzzle.
 *
 * @throws {IncorrectGridError} when a valid solution cannot be generated
 */
export function createPuzzleSolved(): Readonly<GridFilled> {
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
export function createPuzzleUnsolved(
	g: Readonly<GridFilled>,
	difficulty: PuzzleDifficultyLevelScore,
): Grid {
	const totalCellsRange = TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[difficulty];
	if (isNil(totalCellsRange)) {
		throw new Error(
			`Total given cells range is not defined for difficulty level: ${difficulty.toString()}`,
		);
	}

	const cellRemovingStrategy = CELL_REMOVING_STRATEGY_BY_DIFFICULTY_LEVEL[difficulty];
	if (isNil(cellRemovingStrategy)) {
		throw new Error(
			`Hole punching function is not defined for difficulty level: '${difficulty.toString()}'`,
		);
	}

	const minimumCellsInLineCount = MINIMUM_GIVEN_CELLS_COUNT_IN_LINE_BY_DIFFICULTY_LEVEL[difficulty];
	if (isNil(minimumCellsInLineCount)) {
		throw new Error(
			`Minimum given cells in line count is not defined for difficulty level: ${difficulty.toString()}`,
		);
	}

	const [low, high] = totalCellsRange;
	return cellRemovingStrategy(g, {
		minimumGivenCells: {
			col: minimumCellsInLineCount,
			row: minimumCellsInLineCount,
			total: { count: low + getRandomInt(high - low), range: totalCellsRange },
		},
	});
}

export function isValueValid(
	g: GridFilled,
	coordinates: GridCellCoordinates,
	value: number,
): boolean {
	return readGridCell(g, coordinates) === value;
}
