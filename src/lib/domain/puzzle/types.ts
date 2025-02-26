import type { Opaque } from '@/lib/utils/types/opaque';
import type { PuzzleDifficultyLevel } from '@/lib/domain/puzzle-difficulty';
import type { TimeISOString } from '@/lib/domain/core/time';

/**
 * String representation of solved puzzle containing both solution and empty cells.
 * Numbers represent fixed values, letters encoded valid
 * @example `1A3HH6...94A5`
 */
export type EncodedPuzzle = Opaque<'encoded-puzzle', string>;

export type Puzzle = {
	difficulty: PuzzleDifficultyLevel;
	id: EncodedPuzzle;
};

export type DBPuzzle = Puzzle & {
	createdAt: TimeISOString;
};
