import type { PuzzleDifficulty } from './types';

export const MINIMUM_REQUIRED_CELLS_COUNT_BY_DIFFICULTY = {
	noob: 36,
	easy: 30,
	expert: 17,
	hard: 20,
	medium: 24,
} satisfies Record<PuzzleDifficulty, number>;
