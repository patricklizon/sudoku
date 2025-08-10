import type { GameId } from "#lib/domain/id/types";
import type { TimeISOString } from "#lib/domain/time/types";

export type GameHistoryEntry = {
	colIdx: number;
	gameId: GameId;
	id: string;
	rowIdx: number;
	value: Option<number>;
};

export type DBGameHistoryEntry = GameHistoryEntry & {
	createdAt: TimeISOString;
};
