import { getRandomInt } from '@/lib/utils/get-random-int';
import { isNil } from '@/lib/utils/is-nil';
import {
	type PuzzleDifficultyLevel,
	TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL,
	MINIMUM_GIVEN_CELLS_COUNT_IN_LINE_BY_DIFFICULTY_LEVEL,
	DIFFICULTY_LEVEL,
} from '@/lib/domain/puzzle-difficulty';
import type { GridFilled, Grid } from '@/lib/domain/puzzle/grid';
import {
	removeCellsJumpingByOneCell,
	removeCellsLeftToRightThenTopToBottom,
	removeCellsRandomly,
	removeCellsWanderingAlongS,
	type CellRemovingFn,
} from './remove-cell-strategies';

const CELL_REMOVING_STRATEGY_BY_DIFFICULTY_LEVEL: Record<PuzzleDifficultyLevel, CellRemovingFn> = {
	[DIFFICULTY_LEVEL[1]]: removeCellsRandomly,
	[DIFFICULTY_LEVEL[2]]: removeCellsRandomly,
	[DIFFICULTY_LEVEL[3]]: removeCellsJumpingByOneCell,
	[DIFFICULTY_LEVEL[4]]: removeCellsWanderingAlongS,
	[DIFFICULTY_LEVEL[5]]: removeCellsLeftToRightThenTopToBottom,
};

/**
 * Creates unsolved sudoku puzzle with unique solution.
 */
export function createPuzzleProblem(
	g: Readonly<GridFilled>,
	difficultyLevel: PuzzleDifficultyLevel,
): Grid {
	const totalCellsRange = TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[difficultyLevel];
	if (isNil(totalCellsRange)) {
		// TODO: extract error
		throw new Error(
			`Total given cells range is not defined for difficulty level: ${difficultyLevel.toString()}`,
		);
	}

	const cellRemovingStrategy = CELL_REMOVING_STRATEGY_BY_DIFFICULTY_LEVEL[difficultyLevel];
	if (isNil(cellRemovingStrategy)) {
		// TODO: extract error
		throw new Error(
			`Hole punching function is not defined for difficulty level: '${difficultyLevel.toString()}'`,
		);
	}

	const minimumCellsInLineCount =
		MINIMUM_GIVEN_CELLS_COUNT_IN_LINE_BY_DIFFICULTY_LEVEL[difficultyLevel];
	if (isNil(minimumCellsInLineCount)) {
		// TODO: extract error
		throw new Error(
			`Minimum given cells in line count is not defined for difficulty level: ${difficultyLevel.toString()}`,
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
