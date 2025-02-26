import { ENCODED_EMPTY_FIELD_CODE_POINT_OFFSET } from './constants';
import type { Grid, GridFilled } from './grid';
import type { EncodedPuzzle } from './types';

/**
 * Decodes an encoded puzzle string into its solution and initial puzzle state
 */
export function decodePuzzle(s: EncodedPuzzle): {
	solution: GridFilled;
	puzzle: Grid;
} {
	const codePointOffset = ENCODED_EMPTY_FIELD_CODE_POINT_OFFSET;
	const solution = [] as unknown as GridFilled;
	const puzzle = [] as unknown as Grid;

	const str = s.split('');

	let number;
	for (const [idx, char] of str.entries()) {
		number = Number.parseInt(char, 10);
		if (Number.isNaN(number)) {
			solution[idx] = Number.parseInt(
				String.fromCodePoint((char.codePointAt(0) ?? 0) - codePointOffset),
				10,
			);
		} else {
			solution[idx] = number;
			puzzle[idx] = number;
		}
	}

	return { solution, puzzle };
}
