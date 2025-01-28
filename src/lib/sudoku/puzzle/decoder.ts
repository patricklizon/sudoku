import type { PuzzleSolution, Puzzle, EncodedPuzzle } from './types';

/**
 * Decodes an encoded puzzle string into its solution and initial puzzle state
 */
export function decodePuzzle(_s: EncodedPuzzle): {
	solution: PuzzleSolution;
	puzzle: Puzzle;
} {
	return { solution: [], puzzle: [] };
}
