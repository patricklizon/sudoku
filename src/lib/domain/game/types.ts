import type { GameId } from '@/lib/domain/core/id';
import type { EncodedPuzzle } from '@/lib/domain/puzzle';
import type { Option } from '@/lib/utils/types/option';
import type { PuzzleDifficultyLevel } from '@/lib/domain/puzzle-difficulty';
import type { TimeISOString } from '@/lib/domain/core/time';

export type Game = {
	createdAt: TimeISOString;
	difficulty: PuzzleDifficultyLevel;
	id: GameId;
	lastOpenedAt: Option<TimeISOString>;
	mode: 'practice' | 'challenge' | 'speed-run';
	puzzleId: EncodedPuzzle;
	status: 'in-progress' | 'success' | 'failure' | 'paused';
	updatedAt: TimeISOString;
};
