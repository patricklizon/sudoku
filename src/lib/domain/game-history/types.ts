import type { GameId } from '@/lib/domain/core/id';
import type { GridCellValue } from '@/lib/domain/puzzle';

export type GameHistory = {
	createdAt: string;
	id: GameId;
	rowIdx: number;
	value: GridCellValue;
};
