import {
	TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL,
	MINIMUM_GIVEN_CELLS_COUNT_IN_LINE_BY_DIFFICULTY_LEVEL,
	INDEX_TRAVERSING_ORDER_BY_DIFFICULTY_LEVEL,
} from '$lib/domain/puzzle/difficulty';
import { type GridFilled, type Grid, removeGridCells } from '$lib/domain/puzzle/grid';
import type { PuzzleDifficultyLevel } from '$lib/domain/puzzle/types';
import { getRandomInt } from '$lib/utils/get-random-int';
import { isNil } from '$lib/utils/is-nil';

/**
 * Creates unsolved sudoku puzzle with unique solution.
 */
export function createPuzzleProblem(
	g: Readonly<GridFilled>,
	difficulty: PuzzleDifficultyLevel,
): Grid {
	const totalCellsRange = TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[difficulty];
	if (isNil(totalCellsRange)) {
		// TODO: extract error
		throw new Error(
			`Total given cells range is not defined for difficulty level: ${difficulty.toString()}`,
		);
	}

	const indexTraversingOrder = INDEX_TRAVERSING_ORDER_BY_DIFFICULTY_LEVEL[difficulty]?.();
	if (isNil(indexTraversingOrder)) {
		// TODO: extract error
		throw new Error(
			`Hole punching function is not defined for difficulty level: '${difficulty.toString()}'`,
		);
	}

	const minimumCellsInLineCount = MINIMUM_GIVEN_CELLS_COUNT_IN_LINE_BY_DIFFICULTY_LEVEL[difficulty];
	if (isNil(minimumCellsInLineCount)) {
		// TODO: extract error
		throw new Error(
			`Minimum given cells in line count is not defined for difficulty level: ${difficulty.toString()}`,
		);
	}

	const [low, high] = totalCellsRange;
	return removeGridCells(g, {
		minimumGivenCells: {
			col: minimumCellsInLineCount,
			row: minimumCellsInLineCount,
			total: {
				count: low + getRandomInt(high - low),
				range: totalCellsRange,
			},
		},
		indexes: indexTraversingOrder,
	});
}
