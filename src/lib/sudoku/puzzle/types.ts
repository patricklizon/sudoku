import type { Opaque } from '@/lib/types/opaque';
import type { Grid, GridFilled } from '../grid';

/**
 * String representation of solved puzzle containing both solution and empty cells.
 * Numbers represent fixed values, letters encoded valid
 * @example `1A3HH6...94A5`
 */
export type EncodedPuzzleSolvable = Opaque<'encoded-puzzle-solvable', string>;

/**
 * Puzzle with all cells correctly filled.
 */
export type PuzzleSolution = GridFilled;

/**
 * Puzzle with correctly filled cells and some empty cells.
 */
export type Puzzle = Grid;

export type PuzzleDifficultyLevel = Opaque<'difficulty-level', number>;
