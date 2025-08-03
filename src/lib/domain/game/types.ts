import type { GameId } from "#src/lib/domain/id";
import type { PuzzleEncoded, PuzzleDifficultyLevel } from "#src/lib/domain/puzzle";
import type { TimeISOString } from "#src/lib/domain/time";

export type Game = {
	difficulty: PuzzleDifficultyLevel;
	id: GameId;
	lastOpenedAt: Option<TimeISOString>;
	mode: "practice" | "challenge" | "speed-run";
	puzzleId: PuzzleEncoded;
	status: "in-progress" | "success" | "failure" | "paused";
};

export type DBGame = Game & {
	createdAt: TimeISOString;
	updatedAt: TimeISOString;
};
