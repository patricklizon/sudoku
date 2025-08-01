import { DIFFICULTY_LEVEL } from './constants';

import type { PuzzleDifficultyLevel } from '#src/lib/domain/puzzle/types';

export function isPuzzleDifficultyLevel(it: string | number): it is PuzzleDifficultyLevel {
	if (typeof it === 'string') {
		it = Number.parseInt(it, 10);
	}

	return it in DIFFICULTY_LEVEL;
}
