import { ENCODED_EMPTY_FIELD_CODE_POINT_OFFSET } from "#src/lib/domain/puzzle/constants";
import { isGridCellFilled } from "#src/lib/domain/puzzle/grid/predicates/is-grid-cell-filled";
import type {
	PuzzleDifficultyLevel,
	PuzzleEncoded,
	PuzzleProblem,
	PuzzleSolution,
} from "#src/lib/domain/puzzle/types";
import { isNil } from "#src/lib/utils/is-nil";

/**
 * Encodes a solvable puzzle into a string format
 */
export function encodePuzzle(
	problem: Readonly<PuzzleProblem>,
	solution: Readonly<PuzzleSolution>,
	difficulty: Readonly<PuzzleDifficultyLevel>,
): PuzzleEncoded {
	const codePointOffset = ENCODED_EMPTY_FIELD_CODE_POINT_OFFSET;
	let result = "";

	for (const [idx, char] of problem.entries()) {
		if (isGridCellFilled(char)) result += char.toString();
		else {
			const p = solution.at(idx)?.toString().codePointAt(0);
			if (isNil(p)) throw new Error("Character not defined");
			result += String.fromCodePoint(p + codePointOffset);
		}
	}

	return encodeURIComponent(result + difficulty.toString()) as PuzzleEncoded;
}
