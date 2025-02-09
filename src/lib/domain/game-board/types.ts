import type { Option } from '@/lib/utils/types/option';
import type { EncodedPuzzle } from '@/lib/domain/puzzle';

export type GameBoard = {
	id: EncodedPuzzle;
	difficulty: string;
	createdAt: string;
	updatedAt: string;
	lastPlayedAt: Option<string>;
};
