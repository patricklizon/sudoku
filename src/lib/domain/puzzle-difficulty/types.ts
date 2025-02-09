import type { Opaque } from '@/lib/utils/types/opaque';

export type PuzzleDifficultyLevelScore = Opaque<'difficulty-level', number>;

export type PuzzleDifficultyLevelName = 'extremely-easy' | 'easy' | 'medium' | 'difficult' | 'evil';
