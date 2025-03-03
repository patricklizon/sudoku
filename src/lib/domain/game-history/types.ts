import type { GameId } from '$lib/domain/id';
import type { TimeISOString } from '$lib/domain/time';
import type { Option } from '$lib/utils/types/option';

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
