import type { Grid, GridFilled } from "./grid";

import type { TimeISOString } from "#src/lib/domain/time";
import type { Opaque } from "#src/lib/utils/types/opaque";

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
	difficulty: PuzzleDifficultyLevel;
	id: PuzzleEncoded;
	problem: PuzzleProblem;
	solution: PuzzleSolution;
};

export type DBPuzzle = {
	createdAt: TimeISOString;
	difficulty: Puzzle["difficulty"];
	id: Puzzle["id"];
};
