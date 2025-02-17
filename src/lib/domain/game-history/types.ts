import type { GameId } from '@/lib/domain/core/id';
import type { GridCellValue } from '@/lib/domain/puzzle';
import type { TimeISOString } from '../core/time';

export type GameHistory = {
	colIdx: number;
	createdAt: TimeISOString;
	id: GameId;
	rowIdx: number;
	value: GridCellValue;
};
