import type { Opaque } from '@/lib/types/opaque';
import type { Grid, GridFilled } from '@/lib/sudoku/grid';

/**
 * String represenation of solved puzzle containig both solution and empty cells.
 * Numbers represent fixed values, letters encoded valid
 * @example `1A3HH6...94A5`
 */
export type EncodedPuzzleSolvable = Opaque<'encoded-puzzle-solvable', string>;

/** Solved puzzle */
export type PuzzleSolved = GridFilled;

/** Solvable puzzle */
export type PuzzleSolvable = Grid;

export type PuzzleDifficulty = 'noob' | 'easy' | 'medium' | 'hard' | 'expert';
