import type { Opaque } from '@/lib/types/opaque';
import type { Grid, GridFilled } from '@/lib/sudoku/grid';

/**
 * String represenation of solved puzzle containig both solution and empty cells
 */
export type EncodedPuzzle = Opaque<'encoded-puzzle', string>;

export type PuzzleSolved = GridFilled;
export type PuzzleSolvable = Grid;
export type PuzzleDifficulty = 'noob' | 'easy' | 'medium' | 'hard' | 'expert';
