import type { Grid, GridFilled } from './grid';
import type { EncodedPuzzle } from './types';

/**
 * Decodes an encoded puzzle string into its solution and initial puzzle state
 */
export function decodePuzzle(_s: EncodedPuzzle): {
	solution: GridFilled;
	puzzle: Grid;
} {
	return { solution: [], puzzle: [] };
}
