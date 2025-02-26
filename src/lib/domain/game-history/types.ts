import type { GameId } from '@/lib/domain/core/id';
import type { GridCellValue } from '@/lib/domain/puzzle';
import type { TimeISOString } from '@/lib/domain/core/time';

export type GameHistoryEntry = {
	colIdx: number;
	createdAt: TimeISOString;
	gameId: GameId;
	id: string;
	rowIdx: number;
	value: GridCellValue;
};
