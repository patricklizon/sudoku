import type { GameId } from '@/lib/domain/core/id';
import type { EncodedPuzzle, GridCellValue } from '@/lib/domain/puzzle';
import type { Option } from '@/lib/utils/types/option';

export type Game = {
	createdAt: string;
	id: GameId;
	lastPlayedAt: string;
	mode: 'practice' | 'challenge' | 'speedrun';
	puzzleId: EncodedPuzzle;
	status:
		| 'new'
		| 'in-progress'
		| 'paused'
		| 'completed-success'
		| 'completed-failure'
		| 'completed-timeout';
	updatedAt: string;
};

export type GameHistory = {
	createdAt: string;
	id: GameId;
	rowIdx: number;
	value: GridCellValue;
};

export type GameBoard = {
	id: EncodedPuzzle;
	difficulty: string;
	createdAt: string;
	updatedAt: string;
	lastPlayedAt: Option<string>;
};
