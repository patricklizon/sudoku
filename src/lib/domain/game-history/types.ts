import type { GameId } from '@/lib/domain/id';
import type { GridCellValue } from '@/lib/domain/puzzle';
import type { TimeISOString } from '@/lib/domain/time';

export type GameHistoryEntry = {
	colIdx: number;
	gameId: GameId;
	id: string;
	rowIdx: number;
	value: GridCellValue;
};

export type DBGameHistoryEntry = GameHistoryEntry & {
	createdAt: TimeISOString;
};
