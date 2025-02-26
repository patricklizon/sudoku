/**
 * @module sudoku/puzzle/difficulty
 *
 * Based on `Sudoku Puzzles Generating: from Easy to Evil`
 * @see https://zhangroup.aporc.org/images/files/Paper_3485.pdf
 *
 * Factors affecting the difficulty level:
 *
 * - The total amount of given cells,
 * - The lower bound of given cells in each row and column,
 * - shape of the generated puzzle
 */

import type { Range } from '@/lib/utils/types/range';
import type { PuzzleDifficultyLevelName, PuzzleDifficultyLevel } from '@/lib/domain/puzzle/types';

export const DIFFICULTY_LEVEL = {
	[1]: 1 as PuzzleDifficultyLevel,
	[2]: 2 as PuzzleDifficultyLevel,
	[3]: 3 as PuzzleDifficultyLevel,
	[4]: 4 as PuzzleDifficultyLevel,
	[5]: 5 as PuzzleDifficultyLevel,
} as const satisfies Record<number, number>;

export const DISABLED_DIFFICULTY_LEVELS = new Set<PuzzleDifficultyLevel>([
	DIFFICULTY_LEVEL[4],
	DIFFICULTY_LEVEL[5],
]);

export const DIFFICULTY_LEVEL_BY_NAME = {
	'extremely-easy': DIFFICULTY_LEVEL[1],
	easy: DIFFICULTY_LEVEL[2],
	medium: DIFFICULTY_LEVEL[3],
	difficult: DIFFICULTY_LEVEL[4],
	evil: DIFFICULTY_LEVEL[5],
} as const satisfies Record<PuzzleDifficultyLevelName, number>;

/**
 * The positioning of empty cells significantly affects the difficulty level even when two
 * puzzles have the same or similar number of given cells at the start of a Sudoku game.
 * A puzzle with given cells clustered together is considered more difficult than one
 * where given cells are scattered evenly. To manage this, minimum number of given cells
 * per row and column is defined.
 */
export const MINIMUM_GIVEN_CELLS_COUNT_IN_LINE_BY_DIFFICULTY_LEVEL: Readonly<
	Record<PuzzleDifficultyLevel, number>
> = {
	[DIFFICULTY_LEVEL[1]]: 5,
	[DIFFICULTY_LEVEL[2]]: 4,
	[DIFFICULTY_LEVEL[3]]: 3,
	[DIFFICULTY_LEVEL[4]]: 2,
	[DIFFICULTY_LEVEL[5]]: 0,
};

/**
 * The more empty cells provided at the start of a Sudoku game,
 * the higher level the puzzle graded in.
 */
export const TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL: Readonly<
	Record<PuzzleDifficultyLevel, Readonly<Range<number>>>
> = {
	[DIFFICULTY_LEVEL[1]]: [50, 62],
	[DIFFICULTY_LEVEL[2]]: [36, 49],
	[DIFFICULTY_LEVEL[3]]: [32, 35],
	[DIFFICULTY_LEVEL[4]]: [28, 31],
	/**
	 * Even though theory makes it possible to create unique sudoku with only 17 filled cells,
	 * generating one with less than 22 given cells is non-trivial.
	 *
	 * @see https://www.technologyreview.com/2012/01/06/188520/mathematicians-solve-minimum-sudoku-problem/
	 */
	[DIFFICULTY_LEVEL[5]]: [23, 27],
};
