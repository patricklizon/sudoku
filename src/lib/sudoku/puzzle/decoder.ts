import type { PuzzleSolution, Puzzle, EncodedPuzzleSolvable } from './types';

/**
 * Decodes an encoded puzzle string into its solution and initial puzzle state
 */
export function decodePuzzle(_s: EncodedPuzzleSolvable): {
	solution: PuzzleSolution;
	puzzle: Puzzle;
} {
	return { solution: [], puzzle: [] };
}
