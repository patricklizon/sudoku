import type { GameId } from "#src/lib/domain/id";
import type { TimeISOString } from "#src/lib/domain/time";

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
