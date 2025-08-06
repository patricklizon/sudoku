import type { GameId } from "#lib/domain/id/types";
import type { TimeISOString, TimeSecond } from "#lib/domain/time/types";

export type GameTimer = {
	gameId: GameId;
	id: string;
	status: "on" | "off";
	timeLimit: Option<TimeSecond>;
	timeSpent: TimeSecond;
};

export type DBGameTimer = GameTimer & {
	updatedAt: TimeISOString;
	createdAt: TimeISOString;
};
