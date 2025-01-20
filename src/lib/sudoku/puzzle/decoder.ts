import type { PuzzleSolved, PuzzleSolvable, EncodedPuzzleSolvable } from './types';

/**
 * Decodes an encoded puzzle string into its solution and initial puzzle state
 */
export function decodePuzzle(s: EncodedPuzzleSolvable): {
	solution: PuzzleSolved;
	puzzle: PuzzleSolvable;
} {
	return { solution: [], puzzle: [] };
}
