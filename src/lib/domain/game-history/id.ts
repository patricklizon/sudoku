import { createRandomStringId } from '@/lib/domain/id';
import type { GameHistoryEntry } from '@/lib/domain/game-history/types';

export function createGameHistoryEnId(): GameHistoryEntry['id'] {
	return createRandomStringId();
}
