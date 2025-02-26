import { ENCODED_EMPTY_FIELD_CODE_POINT_OFFSET } from './constants';
import { isGridCellFilled, type Grid, type GridFilled } from './grid';
import type { EncodedPuzzle } from './types';

/**
 * Encodes a solvable puzzle into a string format
 */
export function encodePuzzle(puzzle: Grid, solution: GridFilled): EncodedPuzzle {
	const codePointOffset = ENCODED_EMPTY_FIELD_CODE_POINT_OFFSET;
	let result = '';

	for (const [idx, char] of puzzle.entries()) {
		if (isGridCellFilled(char)) result += char.toString();
		else {
			result += String.fromCodePoint(
				(solution[idx]?.toString().codePointAt(0) ?? 0) + codePointOffset,
			);
		}
	}

	return result as EncodedPuzzle;
}
