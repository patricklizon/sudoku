import type { PuzzleSolved, PuzzleSolvable, EncodedPuzzle } from './types';

/**
 * Decodes an encoded puzzle string into its solution and initial puzzle state
 */
export function decodePuzzle(s: EncodedPuzzle): { solution: PuzzleSolved; puzzle: PuzzleSolvable } {
	return { solution: [], puzzle: [] };
}
