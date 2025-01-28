/**
 * @module sudoku/puzzle/difficulty
 *
 * Factors affecting the difficulty level:
 *
 * - The total amount of given cells,
 * - The lower bound of given cells in each row and column,
 */

import type { Range } from '@/lib/types/range';
import type { PuzzleDifficultyLevel } from './types';
import {
	punchHolesRandomly,
	punchHolesJumpingByOneCell,
	punchHolesLeftToRightThenTopToBottom,
	wanderingAlongS,
	type HolePunchingFn,
} from './hole-punching';

export const DifficultyLevel = {
	/** extreamly easy */
	[1]: 1 as PuzzleDifficultyLevel,
	/** easy */
	[2]: 2 as PuzzleDifficultyLevel,
	/** medium */
	[3]: 3 as PuzzleDifficultyLevel,
	/** difficult */
	[4]: 4 as PuzzleDifficultyLevel,
	/** evil */
	[5]: 5 as PuzzleDifficultyLevel,
} as const;

/**
 * The more empty cells provided at the start of a Sudoku game,
 * the higher level the puzzle graded in.
 */
export const TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL: Readonly<
	Record<PuzzleDifficultyLevel, Readonly<Range<number>>>
> = {
	[DifficultyLevel[1]]: [50, 80],
	[DifficultyLevel[2]]: [36, 49],
	[DifficultyLevel[3]]: [32, 35],
	[DifficultyLevel[4]]: [28, 31],
	/**
	 * Even though theory makes it possible to create unique sudoku with only 17 filled cells,
	 * generating one with less than 22 given cells is non-trivial.
	 *
	 * @see https://www.technologyreview.com/2012/01/06/188520/mathematicians-solve-minimum-sudoku-problem/
	 * @see https://zhangroup.aporc.org/images/files/Paper_3485.pdf
	 */
	[DifficultyLevel[5]]: [23, 27],
};

/**
 * The positioning of empty cells significantly affects the difficulty level even when two
 * puzzles have the same or similar number of given cells at the start of a Sudoku game.
 * A puzzle with given cells clustered together is considered more difficult than one
 * where given cells are scattered evenly. To manage this, minimum number of given cells
 * that must appear in each row and column for each difficulty level is defined.
 */
export const LOWER_BOUND_OF_GIVEN_CELLS_IN_ROW_AND_COLUMN_BY_DIFFICULTY_LEVEL: Readonly<
	Record<PuzzleDifficultyLevel, number>
> = {
	[DifficultyLevel[1]]: 5,
	[DifficultyLevel[2]]: 4,
	[DifficultyLevel[3]]: 3,
	[DifficultyLevel[4]]: 2,
	[DifficultyLevel[5]]: 0,
};

export const holePunchingStrategyByDifficultyLevel = {
	[DifficultyLevel[1]]: punchHolesRandomly,
	[DifficultyLevel[2]]: punchHolesRandomly,
	[DifficultyLevel[3]]: punchHolesJumpingByOneCell,
	[DifficultyLevel[4]]: wanderingAlongS,
	[DifficultyLevel[5]]: punchHolesLeftToRightThenTopToBottom,
} satisfies Record<PuzzleDifficultyLevel, HolePunchingFn>;
