import type { Grid, GridFilled } from "#src/lib/domain/puzzle/grid/types";
import type { TimeISOString } from "#src/lib/domain/time/types";

export type PuzzleDifficultyLevel = Opaque<"difficulty-level", number>;

export type PuzzleDifficultyLevelName = "extremely-easy" | "easy" | "medium" | "difficult" | "evil";

/**
 * String representation of solved puzzle containing both solution, empty cells, and difficulty.
 * Numbers represent fixed values, letters encoded valid, last digit represents difficulty level.
 * @example `1A3HH6...94A5<difficulty level>`
 */
export type PuzzleEncoded = Opaque<"encoded-puzzle", string>;

export type PuzzleSolution = GridFilled;

export type PuzzleProblem = Grid;

export type Puzzle = {
	difficultyLevel: PuzzleDifficultyLevel;
	id: PuzzleEncoded;
	problem: PuzzleProblem;
	solution: PuzzleSolution;
};

export type DBPuzzle = {
	createdAt: TimeISOString;
	difficultyLevel: Puzzle["difficultyLevel"];
	id: Puzzle["id"];
};
