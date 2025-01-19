import type { PuzzleDifficulty } from './types';

export const MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY = {
	easy: 80,
	expert: 17,
	hard: 50,
	normal: 60,
} satisfies Record<PuzzleDifficulty, number>;
