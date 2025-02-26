import type { GameId } from '@/lib/domain/id';
import type { PuzzleEncoded, PuzzleDifficultyLevel } from '@/lib/domain/puzzle';
import type { Option } from '@/lib/utils/types/option';

import type { TimeISOString } from '@/lib/domain/time';

export type Game = {
	difficulty: PuzzleDifficultyLevel;
	id: GameId;
	lastOpenedAt: Option<TimeISOString>;
	mode: 'practice' | 'challenge' | 'speed-run';
	puzzleId: PuzzleEncoded;
	status: 'in-progress' | 'success' | 'failure' | 'paused';
};

export type DBGame = Game & {
	createdAt: TimeISOString;
	updatedAt: TimeISOString;
};
