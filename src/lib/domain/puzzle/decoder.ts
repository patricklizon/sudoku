import { ENCODED_EMPTY_FIELD_CODE_POINT_OFFSET } from "#src/lib/domain/puzzle/constants";
import { isPuzzleDifficultyLevel } from "#src/lib/domain/puzzle/difficulty/predicate";
import type {
	PuzzleDifficultyLevel,
	PuzzleEncoded,
	PuzzleProblem,
	PuzzleSolution,
} from "#src/lib/domain/puzzle/types";

/**
 * Decodes an encoded puzzle string into its solution and initial puzzle state
 */
export function decodePuzzle(s: PuzzleEncoded): {
	solution: PuzzleSolution;
	problem: PuzzleProblem;
	difficulty: PuzzleDifficultyLevel;
} {
	const codePointOffset = ENCODED_EMPTY_FIELD_CODE_POINT_OFFSET;
	const solution = [] as unknown as PuzzleSolution;
	const problem = [] as unknown as PuzzleProblem;

	const difficulty = Number.parseInt(s.at(-1) ?? "", 10);
	if (!isPuzzleDifficultyLevel(difficulty)) {
		throw new Error("Difficulty level is not defined");
	}

	const str = s.slice(0, -1).split("");

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
			problem[idx] = number;
		}
	}

	return { solution, problem, difficulty };
}
