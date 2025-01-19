import type { PuzzleDifficulty } from './types';

export const MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY = {
	easy: 4,
	expert: 1,
	hard: 2,
	normal: 3,
} satisfies Record<PuzzleDifficulty, number>;
